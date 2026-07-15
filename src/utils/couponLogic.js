export const coupons = {
  'SAVE10': { discount: 10, type: 'percentage', minOrder: 500 },
  'SAVE20': { discount: 20, type: 'percentage', minOrder: 1000 },
  'FLAT50': { discount: 50, type: 'fixed', minOrder: 300 }
};

export const applyCoupon = (code, total) => {
  const coupon = coupons[code.toUpperCase()];
  
  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid coupon code' };
  }

  if (total < coupon.minOrder) {
    return { 
      valid: false, 
      discount: 0, 
      message: `Minimum order of ₹${coupon.minOrder} required for this coupon` 
    };
  }

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (total * coupon.discount) / 100;
  } else {
    discount = coupon.discount;
  }

  return {
    valid: true,
    discount: discount,
    message: `Coupon applied! You saved ₹${discount.toFixed(2)}`
  };
};
