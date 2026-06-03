import { Order } from '../types';

/**
 * Formats a number to Indian Rupee (₹) currency format
 * @param amount Number to format
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Checks if an order item is eligible for return
 * Rules:
 * 1. Order status must be 'Delivered'
 * 2. System date must be <= 7 days from deliveryDate
 * @param order Order object to evaluate
 */
export const canReturnOrder = (order: Order): boolean => {
  if (order.status !== 'Delivered' || !order.deliveryDate) {
    return false;
  }

  try {
    const deliveryDate = new Date(order.deliveryDate);
    const currentDate = new Date();

    // Reset times to compare dates accurately
    const dDate = new Date(
      deliveryDate.getFullYear(),
      deliveryDate.getMonth(),
      deliveryDate.getDate()
    );
    const cDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const diffTime = Math.abs(cDate.getTime() - dDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Must be within 7 days (less than or equal to 7 days)
    return diffDays <= 7;
  } catch (error) {
    console.error('Error calculating return eligibility:', error);
    return false;
  }
};

/**
 * Formats a date string to a human-readable format
 * @param dateStr ISO date string
 */
export const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
};
