import { Request, Response, NextFunction } from 'express';
import User from './user.model';
import EmailVerificationToken from './emailVerificationToken.model';
import bcrypt from 'bcrypt';
import { AppError } from '../../utils/AppError';
import { Op } from 'sequelize';

/**
 * GET /api/admin/users
 * Get all users with filtering, sorting and pagination
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string;
    const status = req.query.status as string;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string;

    const offset = (page - 1) * limit;
    let whereClause: any = {};
    let orderBy: any = [['createdAt', 'DESC']];

    // Apply filters
    if (role) {
      whereClause.role = role;
    }

    if (status) {
      if (status === 'active') {
        whereClause.isActive = true;
      } else if (status === 'inactive') {
        whereClause.isActive = false;
      } else if (status === 'suspended') {
        whereClause.isSuspended = true;
      }
    }

    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    // Apply sorting
    if (sortBy === 'name-asc') {
      orderBy = [['fullName', 'ASC']];
    } else if (sortBy === 'name-desc') {
      orderBy = [['fullName', 'DESC']];
    } else if (sortBy === 'date-new') {
      orderBy = [['createdAt', 'DESC']];
    } else if (sortBy === 'date-old') {
      orderBy = [['createdAt', 'ASC']];
    }

    // Get total count and paginated data
    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      order: orderBy,
      limit,
      offset,
      attributes: [
        'id',
        'fullName',
        'email',
        'role',
        'isActive',
        'emailVerified',
        'createdAt',
        'updatedAt',
      ],
      raw: true,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        users: rows.map(user => ({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          accountStatus: user.isActive ? 'active' : 'inactive',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users/:userId
 * Get a single user by ID
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: [
        'id',
        'fullName',
        'email',
        'accountType',
        'role',
        'isActive',
        'emailVerified',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        accountType: user.accountType,
        role: user.role,
        accountStatus: user.isActive ? 'active' : 'inactive',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/users
 * Create a new user
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName, email, password, role, accountType } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return next(new AppError('Missing required fields', 400));
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'user',
      accountType: accountType || 'company',
      isActive: true,
      emailVerified: true, // Admin can create verified users
    });

    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        accountStatus: 'active',
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/users/:userId
 * Update user information
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { fullName, email } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Update fields
    if (fullName) user.fullName = fullName;
    if (email) {
      // Check if new email is already in use
      const existingUser = await User.findOne({
        where: { email, id: { [Op.ne]: userId } },
      });
      if (existingUser) {
        return next(new AppError('Email already in use', 400));
      }
      user.email = email;
    }

    await user.save();

    res.json({
      success: true,
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        accountStatus: user.isActive ? 'active' : 'inactive',
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/users/:userId/role
 * Change user role
 */
export const changeUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['user', 'admin', 'support', 'gestionnaire-technique'];
    if (!validRoles.includes(role)) {
      return next(new AppError('Invalid role', 400));
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      data: {
        id: user.id,
        role: user.role,
        message: `User role changed to ${role}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/users/:userId/status
 * Toggle user account status
 */
export const toggleUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { accountStatus } = req.body;

    // Validate status
    const validStatuses = ['active', 'inactive', 'suspended'];
    if (!validStatuses.includes(accountStatus)) {
      return next(new AppError('Invalid account status', 400));
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Update status
    if (accountStatus === 'active') {
      user.isActive = true;
      // @ts-ignore
      user.isSuspended = false;
    } else if (accountStatus === 'inactive') {
      user.isActive = false;
      // @ts-ignore
      user.isSuspended = false;
    } else if (accountStatus === 'suspended') {
      user.isActive = false;
      // @ts-ignore
      user.isSuspended = true;
    }

    await user.save();

    res.json({
      success: true,
      data: {
        id: user.id,
        accountStatus,
        message: `User status updated to ${accountStatus}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/users/:userId/reset-password
 * Reset user password
 */
export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return next(new AppError('Password must be at least 6 characters', 400));
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      data: {
        id: user.id,
        message: 'User password reset successfully',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/users/:userId/suspend
 * Suspend user access
 */
export const suspendUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // @ts-ignore
    user.isSuspended = true;
    user.isActive = false;
    // @ts-ignore
    user.suspensionReason = reason || 'Suspended by admin';

    await user.save();

    res.json({
      success: true,
      data: {
        id: user.id,
        accountStatus: 'suspended',
        message: 'User suspended successfully',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/users/:userId
 * Delete a user
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Remove dependent records that reference this user to avoid FK constraint errors
    // Delete email verification tokens linked to the user first
    try {
      await EmailVerificationToken.destroy({ where: { userId } });
    } catch (err) {
      // Log and continue; if this fails the DB FK will still prevent deletion
      console.warn('Warning: failed to delete email verification tokens for user', userId, err);
    }

    await user.destroy();

    res.json({
      success: true,
      data: {
        id: userId,
        message: 'User deleted successfully',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users/:userId/activity-logs
 * Get user activity logs (placeholder)
 */
export const getUserActivityLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // TODO: Implement activity logging
    res.json({
      success: true,
      data: {
        userId,
        activityLogs: [],
        message: 'Activity logging coming soon',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users/export
 * Export users data (CSV or JSON)
 */
export const exportUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const format = (req.query.format as string) || 'csv';

    const users = await User.findAll({
      attributes: [
        'id',
        'fullName',
        'email',
        'role',
        'isActive',
        'emailVerified',
        'createdAt',
      ],
      raw: true,
    });

    if (format === 'json') {
      res.json({
        success: true,
        data: users.map(user => ({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          accountStatus: user.isActive ? 'active' : 'inactive',
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
        })),
      });
    } else if (format === 'csv') {
      // Convert to CSV
      const headers = [
        'ID',
        'Full Name',
        'Email',
        'Role',
        'Status',
        'Email Verified',
        'Created At',
      ];
      const rows = users.map(user => [
        user.id,
        user.fullName,
        user.email,
        user.role,
        user.isActive ? 'active' : 'inactive',
        user.emailVerified ? 'yes' : 'no',
        new Date(user.createdAt).toISOString(),
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
      res.send(csv);
    } else {
      return next(new AppError('Invalid format', 400));
    }
  } catch (error) {
    next(error);
  }
};
