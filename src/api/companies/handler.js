class CompaniesHandler {
  constructor(service) {
    this._service = service;

    this.postCompanyHandler = this.postCompanyHandler.bind(this);
    this.getCompaniesHandler = this.getCompaniesHandler.bind(this);
    this.getCompanyByIdHandler = this.getCompanyByIdHandler.bind(this);
    this.putCompanyByIdHandler = this.putCompanyByIdHandler.bind(this);
    this.deleteCompanyByIdHandler = this.deleteCompanyByIdHandler.bind(this);
  }

  async postCompanyHandler(req, res, next) {
    try {
      const { name, location, description } = req.body;
      const companyId = await this._service.addCompany({ name, location, description });
      res.status(201).json({
        status: 'success',
        data: { id: companyId }
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompaniesHandler(req, res, next) {
    try {
      const companies = await this._service.getCompanies();
      res.json({
        status: 'success',
        data: { companies }
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const company = await this._service.getCompanyById(id);
      res.json({
        status: 'success',
        data: company
      });
    } catch (error) {
      next(error);
    }
  }

  async putCompanyByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { name, location, description } = req.body;
      await this._service.updateCompanyById(id, { name, location, description });
      res.json({
        status: 'success',
        message: 'Perusahaan berhasil diperbarui'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCompanyByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteCompanyById(id);
      res.json({
        status: 'success',
        message: 'Perusahaan berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CompaniesHandler;