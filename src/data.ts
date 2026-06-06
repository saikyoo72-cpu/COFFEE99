export interface MenuItem {
  name: string;
  description: string;
  price: string;
  image: string;
  highlight?: boolean;
  isVeg?: boolean;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface Branch {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  hours: string;
  mapEmbed: string;
  gallery: string[];
  menu: MenuCategory[];
  phone?: string;
  googleBusinessProfile?: string;
  rating?: number;
  reviews?: number;
}

export const fullMenu: MenuCategory[] = [
  {
    title: "HOT COFFEE",
    items: [
      { name: "Cappuccino", description: "Classic hot coffee with steamed milk and foam.", price: "Rs. 90/-", image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Caffe Latte", description: "Smooth espresso with steamed milk.", price: "Rs. 99/-", image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Vanilla Latte", description: "Latte with a touch of vanilla.", price: "Rs. 120/-", image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Caramel Latte", description: "Smooth latte with caramel syrup.", price: "Rs. 120/-", image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Hazelnut Cappuccino", description: "Cappuccino with a rich hazelnut flavor.", price: "Rs. 120/-", image: "https://images.unsplash.com/photo-1517701550737-265d0727c996?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Caffe Mocha (Add Choco Sauce)", description: "Extra chocolatey mocha with choco sauce.", price: "Rs. 99/-", image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "COLD COFFEE",
    items: [
      { name: "Classic Cold Coffee", description: "Refreshing blended cold coffee.", price: "₹119", image: "https://images.unsplash.com/photo-1517701550737-265d0727c996?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Dark Frappe (Add Ice Cream)", description: "Rich dark coffee frappe with ice cream.", price: "₹129", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Choco Frappe (Add Ice Cream & Choco Chips)", description: "Chocolatey frappe with ice cream and chips.", price: "₹149", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Hazelnut Cold Coffee", description: "Cold coffee with a hazelnut twist.", price: "₹149", image: "https://images.unsplash.com/photo-1517701550737-265d0727c996?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Caramel Cold Coffee", description: "Sweet caramel flavored cold coffee.", price: "₹149", image: "https://images.unsplash.com/photo-1517701550737-265d0727c996?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Classic Cold Coffee with Boba", description: "Our classic cold coffee with chewy boba.", price: "₹149", image: "https://images.unsplash.com/photo-1517701550737-265d0727c996?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "ICED COFFEE",
    items: [
      { name: "Strong Iced Coffee", description: "Bold and chilled iced coffee.", price: "₹119", image: "https://images.unsplash.com/photo-1517701550737-265d0727c996?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "TEA",
    items: [
      { name: "Masala Tea (1 cup)", description: "Traditional spiced Indian tea.", price: "₹49", image: "https://images.unsplash.com/photo-1544787210-228394c3d3e2?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Masala Tea (2 cup)", description: "Traditional spiced Indian tea for two.", price: "₹80", image: "https://images.unsplash.com/photo-1544787210-228394c3d3e2?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Darjeeling Tea (Without Milk)", description: "Pure Darjeeling tea for a light experience.", price: "₹39", image: "https://images.unsplash.com/photo-1594631252845-29fc4586c562?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "ICED TEA",
    items: [
      { name: "Peach Ice Tea", description: "Sweet and fruity peach iced tea.", price: "₹119", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Lemon Ice Tea", description: "Zesty and refreshing lemon iced tea.", price: "₹119", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "MILK SHAKES",
    items: [
      { name: "Oreo Shake", description: "Creamy shake with crushed Oreo cookies.", price: "₹119", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "KitKat Shake", description: "Milkshake with KitKat chocolate pieces.", price: "₹119", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Strawberry Shake", description: "Classic strawberry flavored milkshake.", price: "₹119", image: "https://images.unsplash.com/photo-1543648964-1402c5553d65?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Chocolate Shake", description: "Rich and thick chocolate milkshake.", price: "₹119", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Vanilla Shake", description: "Smooth and creamy vanilla milkshake.", price: "₹119", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Blueberry Shake", description: "Fruity blueberry flavored milkshake.", price: "₹119", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Mango Shake", description: "Tropical mango flavored milkshake.", price: "₹119", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "SPECIAL SHAKE WITH ICE CREAM",
    items: [
      { name: "Special Oreo Shake with Ice Cream", description: "Oreo shake topped with a scoop of ice cream.", price: "₹149", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Special KitKat Shake with Ice Cream", description: "KitKat shake topped with a scoop of ice cream.", price: "₹149", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Special Strawberry Shake with Ice Cream", description: "Strawberry shake topped with a scoop of ice cream.", price: "₹149", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Special Chocolate Shake with Ice Cream", description: "Chocolate shake topped with a scoop of ice cream.", price: "₹149", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Special Vanilla Shake with Ice Cream", description: "Vanilla shake topped with a scoop of ice cream.", price: "₹149", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Special Blueberry Shake with Ice Cream", description: "Blueberry shake topped with a scoop of ice cream.", price: "₹149", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Mango Shake with Ice Cream", description: "Mango shake topped with a scoop of ice cream.", price: "₹149", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "BOBA SHAKES & MOJITO",
    items: [
      { name: "Green Apple Mojito with Boba", description: "Refreshing mojito with green apple and boba.", price: "₹119", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Watermelon Mojito with Boba", description: "Cooling watermelon mojito with boba.", price: "₹119", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Blueberry Mojito with Boba", description: "Sweet blueberry mojito with boba.", price: "₹119", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "KitKat Shake with Boba", description: "KitKat shake with chewy boba pearls.", price: "₹149", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Oreo Shake with Boba", description: "Oreo shake with chewy boba pearls.", price: "₹149", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Mango Shake with Boba", description: "Mango shake with chewy boba pearls.", price: "₹149", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "REFRESHING DRINKS",
    items: [
      { name: "Blue Lemon", description: "Refreshing blue citrus drink.", price: "₹80 / ₹90 / ₹119", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Lime Soda", description: "Classic fizzy lime soda.", price: "₹80 / ₹90 / ₹119", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Masala Soda", description: "Spicy and tangy masala soda.", price: "₹80 / ₹90 / ₹119", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Masala Coke", description: "Coke with a spicy masala twist.", price: "₹80 / ₹90 / ₹119", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Green Apple Mojito", description: "Refreshing green apple flavored mojito.", price: "₹80 / ₹90 / ₹119", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Watermelon Mojito", description: "Cooling watermelon flavored mojito.", price: "₹80 / ₹90 / ₹119", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Coke", description: "Classic chilled Coca-Cola.", price: "₹50 / ₹70 / ₹90", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "🥤 DRINK COMBO",
    items: [
      { name: "Coke (2 Glasses)", description: "Two glasses of refreshing Coca-Cola.", price: "Rs. 90/-", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "MOCKTAILS",
    items: [
      { name: "Green Apple Lemonade", description: "Tangy green apple flavored lemonade.", price: "₹99", image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Watermelon Lemonade", description: "Refreshing watermelon flavored lemonade.", price: "₹99", image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Strawberry Lemonade", description: "Sweet strawberry flavored lemonade.", price: "₹99", image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "ICE CREAM",
    items: [
      { name: "Vanilla Ice Cream with Chocolate Sauce & Choco Chips", description: "Classic vanilla with choco toppings.", price: "₹99", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Chocolate Ice Cream with Chocolate Sauce & Choco Chips", description: "Rich chocolate ice cream with toppings.", price: "₹119", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Butter Scotch with Chocolate Sauce & Choco Chips", description: "Crunchy butterscotch with toppings.", price: "₹119", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "HOT DESSERT",
    items: [
      { name: "Hot Brownie", description: "Warm, gooey & chocolate heaven", price: "₹99", image: "https://i.ibb.co/7dfLj61B/unnamed.jpg", isVeg: true },
      { name: "Hot Brownie with Vanilla Ice Cream", description: "Warm chocolate brownie with cold vanilla ice cream.", price: "₹99", image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "JAR ICE CREAM",
    items: [
      { name: "Vanilla Jar Ice Cream", description: "Creamy vanilla ice cream served in a jar.", price: "₹149", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "KitKat Jar Ice Cream", description: "KitKat flavored ice cream in a jar.", price: "₹149", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Oreo Jar Ice Cream", description: "Oreo flavored ice cream in a jar.", price: "₹149", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Butterscotch Jar Ice Cream", description: "Butterscotch flavored ice cream in a jar.", price: "₹149", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "🍔 BURGER COMBOS & OFFERS",
    items: [
      { name: "Crispy Veg Burger + Fries + Coke", description: "Veg burger meal with fries and coke.", price: "Rs. 119/-", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Crispy Chicken Burger + Fries + Coke", description: "Chicken burger meal with fries and coke.", price: "Rs. 129/-", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Crispy Chicken Burger (2 pcs)", description: "Two crispy chicken patties in soft buns.", price: "Rs. 119/-", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Crispy Veg Burger (2 pcs)", description: "Two crispy vegetable patties in soft buns.", price: "Rs. 99/-", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Soya Chicken Burger + Fries + Coke", description: "Soya chicken burger meal with fries and coke.", price: "Rs. 119/-", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Burger + Coke (Veg)", description: "Veg burger with a refreshing coke.", price: "Rs. 90/-", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Burger + Coke (Chicken)", description: "Chicken burger with a refreshing coke.", price: "Rs. 99/-", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Crispy Veg Burger + Peri Peri Fries + Coke", description: "Veg burger meal with spicy peri peri fries and coke.", price: "Rs. 139/-", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Crispy Chicken Burger + Peri Peri Fries + Coke", description: "Chicken burger meal with spicy peri peri fries and coke.", price: "Rs. 149/-", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400", isVeg: false }
    ]
  },
  {
    title: "🍔 SINGLE BURGERS",
    items: [
      { name: "Tandoori Burger Veg", description: "Veg burger with tandoori sauce.", price: "Rs. 60/-", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Tandoori Burger Chicken", description: "Chicken burger with tandoori sauce.", price: "Rs. 70/-", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Soya Chicken Burger", description: "Delicious soya-based chicken flavor burger.", price: "Rs. 59/-", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Potato Crunch Veg Burger", description: "Crunchy potato patty veg burger.", price: "Rs. 39/-", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "🥪 SANDWICH",
    items: [
      { name: "Cheese Corn Sandwich + Veg Burger", description: "A combo of cheesy corn sandwich and a veg burger.", price: "Rs. 99/-", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Cheese & Corn Sandwich", description: "Grilled sandwich with cheese and sweet corn.", price: "Rs. 99/-", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Grilled Veg Sandwich", description: "Classic grilled sandwich with fresh veggies.", price: "Rs. 59/-", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Mozzarella Cheese Veg Sandwich", description: "Veg sandwich with melted mozzarella.", price: "Rs. 80/-", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Paneer Tikka Cheese Sandwich", description: "Spicy paneer tikka with cheese in a sandwich.", price: "Rs. 119/-", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Chicken Sandwich", description: "Grilled sandwich with juicy chicken filling.", price: "Rs. 90/-", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400", isVeg: false }
    ]
  },
  {
    title: "CUTLET",
    items: [
      { name: "Fish Cutlet (2 pcs)", description: "Two pieces of crispy fried fish cutlets.", price: "₹119", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Fish Finger (3 pcs)", description: "Three pieces of crunchy fish fingers.", price: "₹99", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Crispy Veg Cutlet (2 pcs)", description: "Two pieces of crispy fried vegetable cutlets.", price: "₹50", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Crispy Chicken Cutlet (2 pcs)", description: "Two pieces of crispy fried chicken cutlets.", price: "₹99", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400", isVeg: false }
    ]
  },
  {
    title: "CHICKEN FRY ITEMS",
    items: [
      { name: "Chicken Cheese Nuggets (4 pcs)", description: "Four cheesy chicken nuggets.", price: "₹65", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Chicken Balls", description: "Juicy bites packed with flavor", price: "₹119", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Chicken Popcorn (8 pcs)", description: "Eight bite-sized chicken popcorn pieces.", price: "₹99", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Chicken Popcorn (18 pcs)", description: "Eighteen bite-sized chicken popcorn pieces.", price: "₹119", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Chicken Wings (5 pcs)", description: "Five pieces of spicy fried chicken wings.", price: "₹99", image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Chicken Wings (10 pcs)", description: "Ten pieces of spicy fried chicken wings.", price: "₹149", image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Chicken Finger (6 pcs)", description: "Six pieces of crunchy chicken fingers.", price: "₹129", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=400", isVeg: false }
    ]
  },
  {
    title: "WRAP",
    items: [
      { name: "Chicken Wrap (2 pcs)", description: "Two chicken wraps with fresh filling.", price: "₹119", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Coffee 99 Chicken Wrap", description: "Our signature chicken wrap.", price: "₹64", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Chicken Cheese Wrap", description: "Chicken wrap with extra melted cheese.", price: "₹69", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=400", isVeg: false },
      { name: "Chicken Jumbo Wrap", description: "Large chicken wrap with extra filling.", price: "₹90", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=400", isVeg: false }
    ]
  },
  {
    title: "VEG WRAP",
    items: [
      { name: "Veg Wrap (2 pcs)", description: "Two vegetable wraps with fresh filling.", price: "₹99", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Coffee 99 Veg Wrap", description: "Our signature vegetable wrap.", price: "₹64", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Veg Cheese Wrap", description: "Vegetable wrap with extra melted cheese.", price: "₹75", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Paneer Wrap", description: "Wrap with marinated paneer cubes.", price: "₹69", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Veg Makhani Wrap", description: "Veg wrap with creamy makhani sauce.", price: "₹99", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "Veg Jumbo Wrap", description: "Large vegetable wrap with extra filling.", price: "₹59", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  },
  {
    title: "FRY ITEMS",
    items: [
      { name: "Loaded Chicken Fries", description: "Crispy, cheesy & fully loaded", price: "₹149", image: "https://i.ibb.co/JjPpxCTY/unnamed.jpg", isVeg: true },
      { name: "French Fry Small", description: "Classic salted french fries - small portion.", price: "₹70", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "French Fry Large", description: "Classic salted french fries - large portion.", price: "₹90", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "French Fry with Mayonnaise", description: "French fries served with creamy mayonnaise.", price: "₹80", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400", isVeg: true },
      { name: "French Fry with Mayonnaise Large", description: "Large portion of fries with mayonnaise.", price: "₹90", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400", isVeg: true }
    ]
  }
];

export const menuItems = fullMenu.flatMap(category => 
  category.items.map((item, idx) => ({
    ...item,
    id: `menu-${category.title}-${idx}`
  }))
);

export const branches: Branch[] = [
  {
    id: "pradhan-nagar",
    name: "COMING SOON",
    description: "Something exciting is brewing.",
    image: "https://files.catbox.moe/x84brt.jpeg", // Mysterious teaser image provided by user
    address: "Pradhan Nagar, Nivedita Road",
    hours: "Reveal Soon",
    mapEmbed: "",
    gallery: [],
    menu: [],
    rating: 5.0,
    reviews: 0,
    status: "COMING SOON" // Added a custom field for easier filtering if needed
  } as any,
  {
    id: "shivmandir",
    name: "Shivmandir",
    description: "A serene spot perfect for a peaceful morning coffee or a sunset treat.",
    image: "https://i.ibb.co/0jz0Shfm/unnamed.jpg",
    address: "Shivmandir, Near Sri Nara Singha Vidyapith, Siliguri, West Bengal",
    hours: "Daily: 10am - 10pm",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.876543210987!2d88.35!3d26.71!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQyJzM2LjAiTiA4OMKwMjEnMDAuMCJF!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin",
    gallery: [
      "https://i.ibb.co/XfzrbgFf/unnamed.jpg",
      "https://i.ibb.co/7wMcdqb/unnamed.jpg",
      "https://i.ibb.co/KxwMX6tS/unnamed.jpg",
      "https://i.ibb.co/79fqpp2/unnamed.jpg"
    ],
    menu: fullMenu,
    phone: "+91 89277 07769",
    googleBusinessProfile: "https://www.google.com/maps/search/?api=1&query=Coffee99+Shivmandir+Near+Sri+Nara+Singha+Vidyapith+Siliguri",
    rating: 4.9,
    reviews: 420
  },
  {
    id: "hakimpara",
    name: "Hakimpara",
    description: "Our vibrant city center location, ideal for quick breaks and social gatherings.",
    image: "https://i.ibb.co/vxWPCj2t/image.jpg",
    address: "Hakimpara, Near Yellow Building, Siliguri, West Bengal",
    hours: "Daily: 10am - 10pm",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.876543210987!2d88.42!3d26.72!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQzJzEyLjAiTiA4OMKwMjUnMTIuMCJF!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin",
    gallery: [
      "https://i.ibb.co/5Xq3chLJ/unnamed.jpg",
      "https://i.ibb.co/CpgCV31b/unnamed.jpg",
      "https://i.ibb.co/yBm5R09d/unnamed.jpg",
      "https://i.ibb.co/zW8zwBpg/unnamed.jpg"
    ],
    menu: fullMenu,
    phone: "+91 89277 07769",
    googleBusinessProfile: "https://www.google.com/maps/search/?api=1&query=Coffee99+Hakimpara+Near+Yellow+Building+Siliguri",
    rating: 4.8,
    reviews: 310
  },
  {
    id: "shalbari",
    name: "Shalbari",
    description: "A cozy retreat offering a relaxed vibe and fresh brews.",
    image: "https://i.ibb.co/4nXGw2tv/unnamed.jpg",
    address: "Shalbari, Near Jio Mart, Siliguri, West Bengal",
    hours: "Daily: 12pm - 9:30pm",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.876543210987!2d88.38!3d26.70!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQyJzAwLjAiTiA4OMKwMjInNDguMCJF!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin",
    gallery: [
      "https://i.ibb.co/3yX5ds3S/unnamed.jpg",
      "https://i.ibb.co/cc9gNG5Z/unnamed.jpg",
      "https://i.ibb.co/WNbzYZsL/unnamed.jpg",
      "https://i.ibb.co/B5fPR0vN/unnamed.jpg"
    ],
    menu: fullMenu,
    phone: "+91 89277 07769",
    googleBusinessProfile: "https://www.google.com/maps/search/?api=1&query=Coffee99+Shalbari+Near+Jio+Mart+Siliguri",
    rating: 4.7,
    reviews: 185
  },
  {
    id: "bara-mohansingh",
    name: "Medical More (Bara Mohansingh)",
    description: "Our flagship store at Medical More, perfect for business meetings, healthcare professionals, and quick breaks.",
    image: "https://i.ibb.co/CpwB72zX/image.jpg",
    address: "Medical More, Near Mukta Nursing Home, Bara Mohansingh, Siliguri, West Bengal",
    hours: "Daily: 10am - 10pm",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.876543210987!2d88.32!3d26.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQwJzQ4LjAiTiA4OMKwMTknMTIuMCJF!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin",
    gallery: [
      "https://i.ibb.co/5hzf4yXC/unnamed.jpg",
      "https://i.ibb.co/RGpnbrRN/unnamed.jpg",
      "https://i.ibb.co/23RqSJS0/unnamed.jpg",
      "https://i.ibb.co/zTfxRFp3/unnamed.jpg"
    ],
    menu: fullMenu,
    phone: "+91 89277 07769",
    googleBusinessProfile: "https://www.google.com/maps/search/?api=1&query=Coffee99+Medical+More+Near+Mukta+Nursing+Home+Bara+Mohansingh+Siliguri",
    rating: 4.9,
    reviews: 295
  },
  {
    id: "ashram-para",
    name: "Ashram Para",
    description: "A modern and spacious outlet perfect for family outings and large groups.",
    image: "https://i.ibb.co/K4GjvKN/image.jpg",
    address: "Ashram Para, Near Anjali Jewellers, Siliguri, West Bengal",
    hours: "Daily: 10am - 10pm",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.876543210987!2d88.37!3d26.73!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQzJzQ4LjAiTiA4OMKwMjInMTIuMCJF!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin",
    gallery: [
      "https://i.ibb.co/VWXT7BXc/image.jpg",
      "https://i.ibb.co/VpCjJcFv/image.jpg",
      "https://i.ibb.co/t5CZG9L/image.jpg",
      "https://i.ibb.co/ym876TG8/image.jpg"
    ],
    menu: fullMenu,
    phone: "+91 89277 07769",
    googleBusinessProfile: "https://www.google.com/maps/search/?api=1&query=Coffee99+Ashram+Para+Near+Anjali+Jewellers+Siliguri",
    rating: 4.8,
    reviews: 240
  }
];

export const testimonials = [
  {
    name: "Arjun Sharma",
    text: "The best espresso in Siliguri! The atmosphere is perfect for getting some work done or just relaxing.",
    rating: 5,
    branchId: "shivmandir"
  },
  {
    name: "Priya Patel",
    text: "Love the neighborhood vibe here. Their cold brew is my daily essential. Highly recommended!",
    rating: 5,
    branchId: "hakimpara"
  },
  {
    name: "Rohan Gupta",
    text: "A hidden gem! The staff is so friendly and the pastries are always fresh and delicious.",
    rating: 4,
    branchId: "shalbari"
  },
  {
    name: "Ananya Iyer",
    text: "I visit the Shivmandir branch often. The coffee is consistently great and the service is top-notch.",
    rating: 5,
    branchId: "shivmandir"
  },
  {
    name: "Vikram Singh",
    text: "Great place to hang out with friends. The Peri Peri fries are a must-try!",
    rating: 5,
    branchId: "bara-mohansingh"
  },
  {
    name: "Ishita Mehra",
    text: "The combos are a great deal. Love the Burger + Cold Coffee combo. Perfect for a quick lunch.",
    rating: 4,
    branchId: "ashram-para"
  }
];

