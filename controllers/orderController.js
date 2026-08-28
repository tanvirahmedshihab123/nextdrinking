import Sale from '../models/Sale.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';

// Generate unique order ID
const generateOrderId = () => {
  const date = new Date();
  const prefix = 'ORD';
  const timestamp = date.getTime().toString().slice(-6);
  return `${prefix}${timestamp}`;
};

// Create a new order (PUBLIC)
export const createOrder = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      customerMobile,
      customerEmail,
      deliveryAddress,
      deliveryTime,
      instructions,
      items,
      paymentMethod = 'due'
    } = req.body;

    // Validate required fields
    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }
    if (!customerName) {
      return res.status(400).json({ message: 'Customer name is required' });
    }
    if (!customerMobile) {
      return res.status(400).json({ message: 'Customer mobile is required' });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' });
    }

    // Get customer
    const customer = await Customer.findOne({ customerId: customerId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Calculate totals and process items
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findOne({ itemNumber: item.itemNumber });
      if (!product) {
        return res.status(404).json({ 
          message: `Product ${item.itemNumber} not found` 
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}` 
        });
      }

      const total = product.unitPrice * item.quantity;
      subtotal += total;

      processedItems.push({
        itemNumber: product.itemNumber,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.unitPrice,
        total: total
      });

      // Update product stock
      await Product.findOneAndUpdate(
        { itemNumber: item.itemNumber },
        { $inc: { quantity: -item.quantity } }
      );
    }

    const totalAmount = subtotal;
    const dueAmount = totalAmount;

    // Create order
    const orderData = {
      saleId: generateOrderId(),
      customerId: customerId,
      customerName: customerName,
      customerMobile: customerMobile,
      customerEmail: customerEmail || '',
      deliveryAddress: deliveryAddress || '',
      deliveryTime: deliveryTime || 'asap',
      items: processedItems,
      subtotal: subtotal,
      discount: 0,
      totalAmount: totalAmount,
      paidAmount: 0,
      dueAmount: dueAmount,
      paymentMethod: paymentMethod,
      saleDate: new Date().toISOString(),
      saleType: 'online',
      status: 'pending',
      note: instructions || 'Order placed online'
    };

    const order = await Sale.create(orderData);

    // Update customer's total due
    await Customer.findOneAndUpdate(
      { customerId: customerId },
      { 
        $inc: { totalDue: dueAmount },
        $set: { updatedAt: new Date() }
      }
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        orderId: order.saleId,
        customerName: order.customerName,
        totalAmount: order.totalAmount,
        dueAmount: order.dueAmount,
        status: order.status,
        orderDate: order.saleDate,
        items: order.items
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (PUBLIC)
export const getOrders = async (req, res) => {
  try {
    const { customerId } = req.query;
    let query = {};
    
    if (customerId) {
      query.customerId = customerId;
    }

    const orders = await Sale.find(query).sort({ saleDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID (PUBLIC)
export const getOrderById = async (req, res) => {
  try {
    const order = await Sale.findOne({ saleId: req.params.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update order status (PROTECTED - Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const order = await Sale.findOneAndUpdate(
      { saleId: req.params.id },
      { 
        status: status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update payment (PROTECTED - Admin only)
export const updatePayment = async (req, res) => {
  try {
    const { paidAmount } = req.body;
    
    if (!paidAmount || paidAmount < 0) {
      return res.status(400).json({ message: 'Valid paid amount is required' });
    }

    const order = await Sale.findOne({ saleId: req.params.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const newPaidAmount = (order.paidAmount || 0) + paidAmount;
    const newDueAmount = Math.max(0, (order.totalAmount || 0) - newPaidAmount);

    const updatedOrder = await Sale.findOneAndUpdate(
      { saleId: req.params.id },
      {
        paidAmount: newPaidAmount,
        dueAmount: newDueAmount,
        updatedAt: new Date()
      },
      { new: true }
    );

    // Update customer's total due if fully paid
    if (newDueAmount === 0 && order.customerId) {
      await Customer.findOneAndUpdate(
        { customerId: order.customerId },
        { 
          $inc: { totalDue: -(order.dueAmount || 0) },
          $set: { updatedAt: new Date() }
        }
      );
    }

    res.json({
      success: true,
      message: 'Payment updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete order (PROTECTED - Admin only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Sale.findOneAndDelete({ saleId: req.params.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ 
      success: true,
      message: 'Order deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: error.message });
  }
};