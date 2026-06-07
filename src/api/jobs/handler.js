class JobsHandler {
  constructor(service) {
    this._service = service;

    this.postJobHandler = this.postJobHandler.bind(this);
    this.getJobsHandler = this.getJobsHandler.bind(this);
    this.getJobByIdHandler = this.getJobByIdHandler.bind(this);
    this.putJobByIdHandler = this.putJobByIdHandler.bind(this);
    this.deleteJobByIdHandler = this.deleteJobByIdHandler.bind(this);
    this.getJobsByCompanyIdHandler = this.getJobsByCompanyIdHandler.bind(this);
    this.getJobsByCategoryIdHandler = this.getJobsByCategoryIdHandler.bind(this);
  }

  async postJobHandler(req, res, next) {
    try {
      const jobId = await this._service.addJob(req.body);
      res.status(201).json({
        status: 'success',
        data: { id: jobId }
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobsHandler(req, res, next) {
    try {
      const { title, 'company-name': companyName } = req.query;
      const jobs = await this._service.getAllJobs({ title, companyName });
      res.json({
        status: 'success',
        data: { jobs }
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const job = await this._service.getJobById(id);
      res.json({
        status: 'success',
        data: job
      });
    } catch (error) {
      next(error);
    }
  }

  async putJobByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.updateJobById(id, req.body);
      res.json({
        status: 'success',
        message: 'Lowongan kerja berhasil diperbarui'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteJobByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteJobById(id);
      res.json({
        status: 'success',
        message: 'Lowongan kerja berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobsByCompanyIdHandler(req, res, next) {
    try {
      const { companyId } = req.params;
      const jobs = await this._service.getJobsByCompanyId(companyId);
      res.json({
        status: 'success',
        data: { jobs }
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobsByCategoryIdHandler(req, res, next) {
    try {
      const { categoryId } = req.params;
      const jobs = await this._service.getJobsByCategoryId(categoryId);
      res.json({
        status: 'success',
        data: { jobs }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = JobsHandler;