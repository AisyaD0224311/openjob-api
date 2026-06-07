class ApplicationsHandler {
  constructor(service) {
    this._service = service;

    this.postApplicationHandler = this.postApplicationHandler.bind(this);
    this.getApplicationsHandler = this.getApplicationsHandler.bind(this);
    this.getApplicationByIdHandler = this.getApplicationByIdHandler.bind(this);
    this.getApplicationsByUserIdHandler = this.getApplicationsByUserIdHandler.bind(this);
    this.getApplicationsByJobIdHandler = this.getApplicationsByJobIdHandler.bind(this);
    this.putApplicationStatusHandler = this.putApplicationStatusHandler.bind(this);
    this.deleteApplicationHandler = this.deleteApplicationHandler.bind(this);
  }

  async postApplicationHandler(req, res, next) {
    try {
      const { user_id, job_id, status } = req.body;
      const applicationId = await this._service.applyJob({ user_id, job_id, status });
      res.status(201).json({
        status: 'success',
        data: { id: applicationId }
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsHandler(req, res, next) {
    try {
      const applications = await this._service.getApplications();
      res.json({
        status: 'success',
        data: { applications }
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const application = await this._service.getApplicationById(id);
      res.json({
        status: 'success',
        data: application
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsByUserIdHandler(req, res, next) {
    try {
      const { userId } = req.params;
      const applications = await this._service.getApplicationsByUserId(userId);
      res.json({
        status: 'success',
        data: { applications }
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsByJobIdHandler(req, res, next) {
    try {
      const { jobId } = req.params;
      const applications = await this._service.getApplicationsByJobId(jobId);
      res.json({
        status: 'success',
        data: { applications }
      });
    } catch (error) {
      next(error);
    }
  }

  async putApplicationStatusHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await this._service.updateApplicationStatus(id, status);
      res.json({
        status: 'success',
        message: 'Status lamaran berhasil diperbarui'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteApplicationHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteApplicationById(id);
      res.json({
        status: 'success',
        message: 'Lamaran pekerjaan berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ApplicationsHandler;