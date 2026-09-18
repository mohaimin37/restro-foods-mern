import asyncHandler from "../middleware/asyncHandler.js";
import MenuItem from "../models/MenuItem.js";

// @desc    Get all menu items (with search, filter, sort, pagination)
// @route   GET /api/menu
// @access  Public
export const getMenuItems = asyncHandler(async (req, res) => {
  const { category, search, isVeg, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

  const query = {};
  if (category) query.category = category;
  if (isVeg) query.isVeg = isVeg === "true";
  if (search) query.$text = { $search: search };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
  };
  const sortOption = sortMap[sort] || { createdAt: -1 };

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const [items, total] = await Promise.all([
    MenuItem.find(query)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    MenuItem.countDocuments(query),
  ]);

  res.json({
    success: true,
    items,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
  });
});

// @desc    Get featured menu items
// @route   GET /api/menu/featured
// @access  Public
export const getFeaturedItems = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({ isFeatured: true, isAvailable: true }).limit(8);
  res.json({ success: true, items });
});

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
export const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Menu item not found");
  }
  res.json({ success: true, item });
});

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private/Admin
export const createMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json({ success: true, item });
});

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
export const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error("Menu item not found");
  }
  res.json({ success: true, item });
});

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
export const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Menu item not found");
  }
  res.json({ success: true, message: "Menu item removed" });
});
