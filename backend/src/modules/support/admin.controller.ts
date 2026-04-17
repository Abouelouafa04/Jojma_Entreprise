import { Request, Response } from 'express';
import { AppError } from '../../utils/AppError';

// Ticket operations
export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const {
      category,
      priority,
      status,
      userId,
      assignedTo,
      search,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    let query: any = {};

    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (assignedTo) query.assignedTo = assignedTo;

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
      ];
    }

    // TODO: Query database using Sequelize or MongoDB
    // const tickets = await Ticket.find(query)
    //   .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    //   .limit(parseInt(limit as string));

    // Mock response for demonstration
    const mockTickets = [
      {
        id: '1',
        ticketNumber: 'TKT-2026-001',
        userId: 'user-1',
        userName: 'Jean Dupont',
        userEmail: 'jean.dupont@example.com',
        subject: 'Impossible de télécharger mon modèle FBX',
        category: 'technical',
        priority: 'high',
        status: 'in-progress',
        createdAt: new Date('2026-04-03'),
        updatedAt: new Date('2026-04-05'),
        messageCount: 3,
      },
    ];

    res.json({
      tickets: mockTickets,
      total: mockTickets.length,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
  } catch (error) {
    throw new AppError('Failed to fetch tickets', 500);
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;

    // TODO: Query database for single ticket
    // const ticket = await Ticket.findById(ticketId);

    const mockTicket = {
      id: ticketId,
      ticketNumber: 'TKT-2026-001',
      userId: 'user-1',
      userName: 'Jean Dupont',
      userEmail: 'jean.dupont@example.com',
      subject: 'Impossible de télécharger mon modèle FBX',
      description: 'Erreur lors du téléchargement d\'un fichier FBX de 50MB',
      category: 'technical',
      priority: 'high',
      status: 'in-progress',
      createdAt: new Date('2026-04-03'),
      updatedAt: new Date('2026-04-05'),
      assignedTo: 'agent-1',
      assignedToName: 'Sophie Martin',
      messageCount: 3,
    };

    if (!mockTicket) {
      throw new AppError('Ticket not found', 404);
    }

    res.json(mockTicket);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch ticket', 500);
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { subject, description, category, priority = 'normal' } = req.body;
    const userId = (req as any).user?.id;

    if (!subject || !description || !category) {
      throw new AppError('Missing required fields', 400);
    }

    // TODO: Create ticket in database
    // const ticket = await Ticket.create({
    //   userId,
    //   subject,
    //   description,
    //   category,
    //   priority,
    //   status: 'open',
    // });

    const newTicket = {
      id: '11',
      ticketNumber: `TKT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      userId,
      subject,
      description,
      category,
      priority,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    res.status(201).json(newTicket);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to create ticket', 500);
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { status, priority, assignedTo } = req.body;

    // TODO: Update ticket in database
    // const ticket = await Ticket.findByIdAndUpdate(ticketId, {
    //   status,
    //   priority,
    //   assignedTo,
    //   updatedAt: new Date(),
    // });

    const updatedTicket = {
      id: ticketId,
      ticketNumber: 'TKT-2026-001',
      status: status || 'open',
      priority: priority || 'normal',
      assignedTo: assignedTo || null,
      updatedAt: new Date(),
    };

    res.json(updatedTicket);
  } catch (error) {
    throw new AppError('Failed to update ticket', 500);
  }
};

export const assignTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
      throw new AppError('Agent ID is required', 400);
    }

    // TODO: Assign ticket in database
    // const ticket = await Ticket.findByIdAndUpdate(ticketId, {
    //   assignedTo: agentId,
    //   status: 'assigned',
    // });

    const assignedTicket = {
      id: ticketId,
      ticketNumber: 'TKT-2026-001',
      assignedTo: agentId,
      status: 'assigned',
      updatedAt: new Date(),
    };

    res.json(assignedTicket);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to assign ticket', 500);
  }
};

export const reassignTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
      throw new AppError('Agent ID is required', 400);
    }

    // TODO: Reassign ticket in database, keeping history
    // const ticket = await Ticket.findByIdAndUpdate(ticketId, {
    //   assignedTo: agentId,
    //   $push: { assignmentHistory: { from: old, to: agentId, reassignedAt: new Date() } },
    // });

    const reassignedTicket = {
      id: ticketId,
      ticketNumber: 'TKT-2026-001',
      assignedTo: agentId,
      updatedAt: new Date(),
    };

    res.json(reassignedTicket);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to reassign ticket', 500);
  }
};

export const changeTicketStatus = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const validStatuses = ['open', 'assigned', 'in-progress', 'waiting', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    // TODO: Update status in database
    // const ticket = await Ticket.findByIdAndUpdate(ticketId, {
    //   status,
    //   updatedAt: new Date(),
    // });

    const updatedTicket = {
      id: ticketId,
      ticketNumber: 'TKT-2026-001',
      status,
      updatedAt: new Date(),
    };

    res.json(updatedTicket);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update ticket status', 500);
  }
};

export const changePriority = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { priority } = req.body;

    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      throw new AppError('Invalid priority', 400);
    }

    // TODO: Update priority in database
    // const ticket = await Ticket.findByIdAndUpdate(ticketId, {
    //   priority,
    //   updatedAt: new Date(),
    // });

    const updatedTicket = {
      id: ticketId,
      ticketNumber: 'TKT-2026-001',
      priority,
      updatedAt: new Date(),
    };

    res.json(updatedTicket);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update ticket priority', 500);
  }
};

export const closeTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { resolution } = req.body;

    // TODO: Close ticket in database
    // const ticket = await Ticket.findByIdAndUpdate(ticketId, {
    //   status: 'closed',
    //   resolution,
    //   closedAt: new Date(),
    // });

    const closedTicket = {
      id: ticketId,
      ticketNumber: 'TKT-2026-001',
      status: 'closed',
      resolution,
      closedAt: new Date(),
    };

    res.json(closedTicket);
  } catch (error) {
    throw new AppError('Failed to close ticket', 500);
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;

    // TODO: Delete ticket from database (or soft delete)
    // await Ticket.findByIdAndDelete(ticketId);

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    throw new AppError('Failed to delete ticket', 500);
  }
};

// Message operations
export const getTicketMessages = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // TODO: Query messages from database
    // const messages = await TicketMessage.find({ ticketId })
    //   .skip((page - 1) * limit)
    //   .limit(limit)
    //   .sort({ createdAt: -1 });

    const mockMessages = [
      {
        id: '1',
        ticketId,
        sender: 'user',
        senderName: 'Jean Dupont',
        message: 'Erreur lors du téléchargement d\'un fichier FBX de 50MB',
        createdAt: new Date('2026-04-03'),
      },
    ];

    res.json(mockMessages);
  } catch (error) {
    throw new AppError('Failed to fetch messages', 500);
  }
};

export const addMessageToTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;
    const senderName = (req as any).user?.name || 'Support Agent';

    if (!message) {
      throw new AppError('Message is required', 400);
    }

    // TODO: Save message to database
    // const newMessage = await TicketMessage.create({
    //   ticketId,
    //   sender: 'agent',
    //   senderName,
    //   message,
    //   attachment: req.file ? { url: req.file.path, filename: req.file.originalname } : null,
    // });

    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      ticketId,
      sender: 'agent',
      senderName,
      message,
      createdAt: new Date(),
    };

    res.status(201).json(newMessage);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to add message', 500);
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { ticketId, messageId } = req.params;

    // TODO: Delete message from database
    // await TicketMessage.findByIdAndDelete(messageId);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    throw new AppError('Failed to delete message', 500);
  }
};

// Statistics
export const getTicketStats = async (req: Request, res: Response) => {
  try {
    // TODO: Calculate stats from database
    // const stats = {
    //   total: await Ticket.countDocuments(),
    //   open: await Ticket.countDocuments({ status: 'open' }),
    //   assigned: await Ticket.countDocuments({ status: 'assigned' }),
    //   inProgress: await Ticket.countDocuments({ status: 'in-progress' }),
    //   resolved: await Ticket.countDocuments({ status: 'resolved' }),
    //   closed: await Ticket.countDocuments({ status: 'closed' }),
    // };

    const stats = {
      total: 10,
      open: 3,
      assigned: 2,
      inProgress: 3,
      waiting: 1,
      resolved: 2,
      closed: 1,
      averageResolutionTime: 24,
      urgentCount: 2,
    };

    res.json(stats);
  } catch (error) {
    throw new AppError('Failed to fetch statistics', 500);
  }
};

export const getTicketsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    // TODO: Query tickets by category
    // const tickets = await Ticket.find({ category });

    const ticketsByCategory = {
      category,
      count: 2,
      tickets: [],
    };

    res.json(ticketsByCategory);
  } catch (error) {
    throw new AppError('Failed to fetch tickets by category', 500);
  }
};

export const getTicketsByPriority = async (req: Request, res: Response) => {
  try {
    const { priority } = req.params;

    // TODO: Query tickets by priority
    // const tickets = await Ticket.find({ priority });

    const ticketsByPriority = {
      priority,
      count: 2,
      tickets: [],
    };

    res.json(ticketsByPriority);
  } catch (error) {
    throw new AppError('Failed to fetch tickets by priority', 500);
  }
};

export const getAgentStats = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    // TODO: Calculate agent statistics
    // const stats = {
    //   agentId,
    //   totalHandled: await Ticket.countDocuments({ assignedTo: agentId }),
    //   resolved: await Ticket.countDocuments({ assignedTo: agentId, status: 'resolved' }),
    // };

    const agentStats = {
      agentId,
      totalHandled: 15,
      resolved: 12,
      averageResolutionTime: 18,
      satisfaction: 4.5,
    };

    res.json(agentStats);
  } catch (error) {
    throw new AppError('Failed to fetch agent statistics', 500);
  }
};

// Bulk operations
export const bulkUpdateStatus = async (req: Request, res: Response) => {
  try {
    const { ticketIds, status } = req.body;

    if (!ticketIds || !status || ticketIds.length === 0) {
      throw new AppError('ticketIds and status are required', 400);
    }

    // TODO: Bulk update in database
    // await Ticket.updateMany({ _id: { $in: ticketIds } }, { status });

    res.json({ message: `Updated ${ticketIds.length} tickets successfully` });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to bulk update tickets', 500);
  }
};

export const bulkAssign = async (req: Request, res: Response) => {
  try {
    const { ticketIds, agentId } = req.body;

    if (!ticketIds || !agentId || ticketIds.length === 0) {
      throw new AppError('ticketIds and agentId are required', 400);
    }

    // TODO: Bulk assign in database
    // await Ticket.updateMany({ _id: { $in: ticketIds } }, { assignedTo: agentId, status: 'assigned' });

    res.json({ message: `Assigned ${ticketIds.length} tickets successfully` });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to bulk assign tickets', 500);
  }
};

// Export
export const exportTickets = async (req: Request, res: Response) => {
  try {
    const { category, priority, status } = req.query;

    // TODO: Generate CSV or Excel file from tickets
    // const tickets = await Ticket.find({
    //   ...(category && { category }),
    //   ...(priority && { priority }),
    //   ...(status && { status }),
    // });

    // Generate CSV content
    const csvContent = 'Ticket Number,User,Subject,Category,Priority,Status,Created\n';

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=tickets.csv');
    res.send(csvContent);
  } catch (error) {
    throw new AppError('Failed to export tickets', 500);
  }
};

// SLA management
export const getSLAConfiguration = async (req: Request, res: Response) => {
  try {
    // TODO: Fetch SLA config from database
    const slaConfig = {
      lowResponseTime: 24,
      normalResponseTime: 12,
      highResponseTime: 4,
      urgentResponseTime: 1,
      lowResolutionTime: 7,
      normalResolutionTime: 3,
      highResolutionTime: 1,
      urgentResolutionTime: 4,
    };

    res.json(slaConfig);
  } catch (error) {
    throw new AppError('Failed to fetch SLA configuration', 500);
  }
};

export const updateSLAConfiguration = async (req: Request, res: Response) => {
  try {
    const config = req.body;

    // TODO: Update SLA config in database
    // await SLAConfiguration.updateOne({}, config);

    res.json({ message: 'SLA configuration updated successfully', config });
  } catch (error) {
    throw new AppError('Failed to update SLA configuration', 500);
  }
};

// Knowledge base
export const searchKnowledgeBase = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      throw new AppError('Query parameter is required', 400);
    }

    // TODO: Search knowledge base
    // const results = await KnowledgeBase.find({
    //   $or: [
    //     { title: { $regex: query, $options: 'i' } },
    //     { content: { $regex: query, $options: 'i' } },
    //   ],
    // });

    const results = [];

    res.json(results);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to search knowledge base', 500);
  }
};

export const addKnowledgeArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content || !category) {
      throw new AppError('Missing required fields', 400);
    }

    // TODO: Save article to database
    // const article = await KnowledgeBase.create({
    //   title,
    //   content,
    //   category,
    //   tags,
    //   createdBy: req.user?.id,
    //   createdAt: new Date(),
    // });

    const newArticle = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      category,
      tags,
      createdAt: new Date(),
    };

    res.status(201).json(newArticle);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to add knowledge article', 500);
  }
};

// Email templates
export const getEmailTemplates = async (req: Request, res: Response) => {
  try {
    // TODO: Fetch email templates from database
    const templates = [
      {
        id: '1',
        name: 'Welcome',
        subject: 'Welcome to JOJMA Support',
        content: 'Dear {{customerName}}, Thank you for contacting us...',
      },
    ];

    res.json(templates);
  } catch (error) {
    throw new AppError('Failed to fetch email templates', 500);
  }
};

export const updateEmailTemplate = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const { content } = req.body;

    if (!content) {
      throw new AppError('Content is required', 400);
    }

    // TODO: Update template in database
    // const template = await EmailTemplate.findByIdAndUpdate(templateId, { content });

    res.json({ message: 'Email template updated successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update email template', 500);
  }
};

export const sendEmailTemplate = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { templateId } = req.body;

    if (!templateId) {
      throw new AppError('Template ID is required', 400);
    }

    // TODO: Send email using template
    // const ticket = await Ticket.findById(ticketId);
    // const template = await EmailTemplate.findById(templateId);
    // await sendEmail(ticket.userEmail, template.subject, template.content);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to send email', 500);
  }
};
