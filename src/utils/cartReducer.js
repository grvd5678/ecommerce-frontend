export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART': {
      return Array.isArray(action.payload) ? action.payload : [];
    }

    case 'ADD_TO_CART': {
      const targetId = action.payload.id || action.payload._id;
      const existingItem = state.find(item => (item.id || item._id) === targetId);
      if (existingItem) {
        return state.map(item =>
          (item.id || item._id) === targetId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    
    case 'REMOVE_FROM_CART':
      return state.filter(item => (item.id || item._id) !== action.payload);
    
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        (item.id || item._id) === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    
    case 'CLEAR_CART':
      return [];
    
    default:
      return state;
  }
};
