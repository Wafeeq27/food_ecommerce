# Email.js Setup Guide for Your Food Store

This guide helps you set up Email.js to send order confirmation emails to customers and admin notifications.

## Step 1: Create Email.js Account

1. Go to https://www.emailjs.com/
2. Click "Sign Up Free"
3. Create account with your email
4. Verify your email

## Step 2: Add Email Service

1. In Email.js dashboard, go to **Email Services**
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (recommended) - Use your Gmail account
   - **Outlook** / **Yahoo** / Custom SMTP
4. Click "Connect Account"
5. Follow the authentication steps
6. Save your **Service ID** (e.g., `service_abc123def`)

## Step 3: Configure Environment Variables

1. In `client/` folder, create a file named `.env.local`

2. Add these variables with placeholder values (you'll update them in step 6):

```
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=your_customer_template_id_here
VITE_EMAILJS_ADMIN_TEMPLATE_ID=your_admin_template_id_here
VITE_EMAILJS_STATUS_TEMPLATE_ID=your_status_template_id_here
VITE_ADMIN_EMAIL=admin@khaleel.com
VITE_API_URL=https://food-ecommerce-oji7.onrender.com/api
```

## Step 4: Create Email Templates

### Template 1: Customer Order Confirmation

1. Go to **Email Templates** → "Create New Template"
2. **Template Name**: `Customer Order Confirmation`
3. **Subject**: `Your Order #{{order_id}} - Khaleel Bhai Mutton Shop`
4. **HTML Content**:

```html
<h2>Thank you for your order, {{customer_name}}!</h2>

<p>Your order has been received and will be prepared shortly.</p>

<h3>Order Details:</h3>
<p><strong>Order ID:</strong> {{order_id}}</p>
<p><strong>Total Amount:</strong> ₹{{total_amount}}</p>

<h3>Items Ordered:</h3>
<pre>{{items_list}}</pre>

<h3>Delivery Address:</h3>
<p>{{delivery_address}}</p>
<p><strong>Phone:</strong> {{phone}}</p>

<h3>Status:</h3>
<p>{{order_status}}</p>

<p>We'll notify you when your order is ready for delivery!</p>

<p>Best regards,<br/>Khaleel Bhai Mutton Shop</p>
```

5. Save and copy the **Template ID** (e.g., `template_xyz789`)
6. Update `.env.local` (step 6): `VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=template_xyz789`

### Template 2: Admin Order Notification

1. Create another template with name `Admin Order Notification`
2. **Subject**: `New Order from {{customer_name}}`
3. **HTML Content**:

```html
<h2>New Order Received!</h2>

<p><strong>Customer:</strong> {{customer_name}}</p>
<p><strong>Email:</strong> {{customer_email}}</p>
<p><strong>Phone:</strong> {{phone}}</p>

<h3>Order #{{order_id}}</h3>

<h3>Items:</h3>
<pre>{{items_list}}</pre>

<p><strong>Total:</strong> ₹{{total_amount}}</p>

<h3>Delivery Address:</h3>
<p>{{delivery_address}}</p>

<p>Please confirm this order in your admin dashboard.</p>
```

4. Copy the **Template ID** and update `.env.local` (step 6): `VITE_EMAILJS_ADMIN_TEMPLATE_ID=template_admin123`

### Template 3: Order Status Update (Optional)

1. Create template `Order Status Update`
2. **Subject**: `Your Khaleel Bhai Order Status: {{order_status}}`
3. **HTML Content**:

```html
<h2>Order Status Update</h2>

<p>Hi {{customer_name}},</p>

<p><strong>Status:</strong> {{order_status}}</p>

<p>{{message}}</p>

<p>Thank you for your business!</p>
```

4. Copy the **Template ID** and update `.env.local` (step 6)

## Step 5: Get Your Public Key

1. In Email.js dashboard, go to **Account** → **API Keys**
2. Copy your **Public Key**
3. Add to `.env.local` (step 6): `VITE_EMAILJS_PUBLIC_KEY=your_public_key`

## Step 6: Update Environment Variables

1. Update your `.env.local` file with the actual values you obtained:

- `VITE_EMAILJS_PUBLIC_KEY` from step 5
- `VITE_EMAILJS_SERVICE_ID` from step 2
- `VITE_EMAILJS_CUSTOMER_TEMPLATE_ID` from step 4
- `VITE_EMAILJS_ADMIN_TEMPLATE_ID` from step 4
- `VITE_EMAILJS_STATUS_TEMPLATE_ID` from step 4 (optional)

2. For deployment, set these environment variables in your hosting platform:

   **Vercel** (Frontend):
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add all the `VITE_` variables from your `.env.local`

   **Render** (Backend):
   - The backend doesn't need Email.js variables since emails are sent from the frontend
   - Make sure `VITE_API_URL` is set in Vercel to point to your Render backend

## Step 7: Test the Integration

1. Go to `/menu` in your app
2. Add an item to cart
3. Place an order
4. Check:
   - ✅ Customer receives confirmation email
   - ✅ Admin receives notification email
   - ✅ Emails have correct order details

## Troubleshooting

### Emails not sending?

1. **Check browser console** (F12) for errors
2. **Verify Email.js Public Key** is correct
3. **Check Service Provider** is connected (Gmail authenticated, etc.)
4. **Verify Template IDs** match exactly
5. **Check variables** in templates match code (`{{customer_name}}` etc.)

### Gmail not working?

- Enable "Less secure app access" or use app passwords
- In Email.js, use OAuth2 authentication

### Email quota exceeded?

- Email.js free tier: 200 emails/month
- Upgrade plan if needed at emailjs.com/pricing

## Advanced: Send Email on Order Status Change

To automatically email customer when admin updates order status:

In `AdminDashboard.jsx`, after `updateOrderStatus()`:

```javascript
import { sendStatusUpdateEmail } from '../utils/emailService';

const updateOrderStatus = async (id, status) => {
  try {
    await api.put(`/orders/${id}/status`, { status });
    
    // Send status update email
    const order = orders.find(o => o._id === id);
    if (order) {
      await sendStatusUpdateEmail(order.user_id.email, order.user_id.name, status);
    }
    
    fetchData();
  } catch (error) {
    console.error('Error updating status', error);
  }
};
```

Then add email sending on order status changes in the admin dashboard.

## That's it! 🎉

Your food store now sends automatic confirmation and notification emails!
