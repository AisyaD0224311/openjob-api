const express = require('express');
require('express-async-errors');
const path = require('path');
require('dotenv').config();

// Middlewares
const errorHandler = require('./middlewares/errorHandler');
const authHandler = require('./middlewares/authHandler');

// Services
const UsersService = require('./services/UsersService');
const AuthenticationsService = require('./services/AuthenticationsService');
const CompaniesService = require('./services/CompaniesService');
const CategoriesService = require('./services/CategoriesService');
const JobsService = require('./services/JobsService');
const ApplicationsService = require('./services/ApplicationsService');
const BookmarksService = require('./services/BookmarksService');
const DocumentsService = require('./services/DocumentsService');

// Routers
const createUsersRouter = require('./api/users/routes');
const createAuthenticationsRouter = require('./api/authentications/routes');
const createCompaniesRouter = require('./api/companies/routes');
const createCategoriesRouter = require('./api/categories/routes');
const createJobsRouter = require('./api/jobs/routes');
const createApplicationsRouter = require('./api/applications/routes');
const createBookmarksRouter = require('./api/bookmarks/routes');
const createProfileRouter = require('./api/profile/routes');
const createDocumentsRouter = require('./api/documents/routes');

// Handlers
const UsersHandler = require('./api/users/handler');
const AuthenticationsHandler = require('./api/authentications/handler');
const CompaniesHandler = require('./api/companies/handler');
const CategoriesHandler = require('./api/categories/handler');
const JobsHandler = require('./api/jobs/handler');
const ApplicationsHandler = require('./api/applications/handler');
const BookmarksHandler = require('./api/bookmarks/handler');
const ProfileHandler = require('./api/profile/handler');
const DocumentsHandler = require('./api/documents/handler');

const app = express();
app.use(express.json());

// Serving static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Instantiate Services
const usersService = new UsersService();
const authenticationsService = new AuthenticationsService();
const companiesService = new CompaniesService();
const categoriesService = new CategoriesService();
const jobsService = new JobsService();
const applicationsService = new ApplicationsService();
const bookmarksService = new BookmarksService();
const documentsService = new DocumentsService();

// Instantiate Handlers
const usersHandler = new UsersHandler(usersService);
const authenticationsHandler = new AuthenticationsHandler(authenticationsService, usersService);
const companiesHandler = new CompaniesHandler(companiesService);
const categoriesHandler = new CategoriesHandler(categoriesService);
const jobsHandler = new JobsHandler(jobsService);
const applicationsHandler = new ApplicationsHandler(applicationsService);
const bookmarksHandler = new BookmarksHandler(bookmarksService);
const profileHandler = new ProfileHandler(usersService, applicationsService, bookmarksService);
const documentsHandler = new DocumentsHandler(documentsService);

// Mount Routers
app.use('/users', createUsersRouter(usersHandler));
app.use('/authentications', createAuthenticationsRouter(authenticationsHandler));
app.use('/companies', createCompaniesRouter(companiesHandler));
app.use('/categories', createCategoriesRouter(categoriesHandler));
app.use('/jobs', createJobsRouter(jobsHandler));
app.use('/applications', createApplicationsRouter(applicationsHandler));
app.use('/bookmarks', createBookmarksRouter(bookmarksHandler));
app.use('/profile', createProfileRouter(profileHandler));
app.use('/documents', createDocumentsRouter(documentsHandler));

// Mount Job Bookmark specific routes explicitly (for maximum reliability)
app.post('/jobs/:jobId/bookmark', authHandler, bookmarksHandler.postBookmarkHandler);
app.delete('/jobs/:jobId/bookmark', authHandler, bookmarksHandler.deleteBookmarkHandler);
app.get('/jobs/:jobId/bookmark/:id', authHandler, bookmarksHandler.getBookmarkByIdHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;