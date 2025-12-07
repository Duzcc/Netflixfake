import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
    const { title } = req.body;

    const categoryExists = await Category.findOne({ title });

    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    const category = await Category.create({
        title,
    });

    if (category) {
        res.status(201).json(category);
    } else {
        res.status(400);
        throw new Error('Invalid category data');
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
        category.title = title || category.title;
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

export { getCategories, createCategory, updateCategory, deleteCategory };
