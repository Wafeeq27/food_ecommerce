import emailjs from 'emailjs-com';

// Initialize EmailJS with your public key
// Get from: https://dashboard.emailjs.com/admin/account
const initEmailJS = () => {
  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY');
};

// Send order confirmation to customer
export const sendCustomerEmail = async (orderData, customerEmail, customerName) => {
  try {
    initEmailJS();

    const itemsList = orderData.items
      .map((item, idx) => `${idx + 1}. ${item.name} - ₹${Math.round(item.price * (item.weight || 0.5) * item.quantity)} (${item.quantity} × ${item.weight || 0.5}kg)`)
      .join('\n');

    const templateParams = {
      to_email: customerEmail,
      customer_name: customerName,
      order_id: orderData.orderId,
      items_list: itemsList,
      total_amount: orderData.total_amount,
      delivery_address: orderData.delivery_address,
      phone: orderData.phone,
      order_status: 'Pending - We will confirm soon!',
      message: 'Thank you for your order! Your fresh meat will be ready soon.'
    };

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID, // e.g., 'service_abc123'
      import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID, // e.g., 'template_xyz789'
      templateParams
    );

    console.log('Customer email sent:', response);
    return response;
  } catch (error) {
    console.error('Failed to send customer email:', error);
    throw error;
  }
};

// Send order notification to admin
export const sendAdminEmail = async (orderData, customerEmail, customerName) => {
  try {
    initEmailJS();

    const itemsList = orderData.items
      .map((item, idx) => `${idx + 1}. ${item.name} - ₹${Math.round(item.price * (item.weight || 0.5) * item.quantity)} (${item.quantity} × ${item.weight || 0.5}kg)`)
      .join('\n');

    const templateParams = {
      to_email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@khaleel.com',
      customer_name: customerName,
      customer_email: customerEmail,
      order_id: orderData.orderId,
      items_list: itemsList,
      total_amount: orderData.total_amount,
      delivery_address: orderData.delivery_address,
      phone: orderData.phone,
      message: `New order received from ${customerName}`
    };

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID, // e.g., 'template_admin123'
      templateParams
    );

    console.log('Admin email sent:', response);
    return response;
  } catch (error) {
    console.error('Failed to send admin email:', error);
    throw error;
  }
};

// Send email on order status update
export const sendStatusUpdateEmail = async (customerEmail, customerName, orderStatus) => {
  try {
    initEmailJS();

    const statusMessages = {
      'Processing': 'We are preparing your order!',
      'Delivered': 'Your order has been delivered. Thank you!',
      'Cancelled': 'Your order has been cancelled.'
    };

    const templateParams = {
      to_email: customerEmail,
      customer_name: customerName,
      order_status: orderStatus,
      message: statusMessages[orderStatus] || 'Your order status has been updated.'
    };

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_STATUS_TEMPLATE_ID, // e.g., 'template_status123'
      templateParams
    );

    console.log('Status update email sent:', response);
    return response;
  } catch (error) {
    console.error('Failed to send status update email:', error);
    throw error;
  }
};
