<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class ReportType extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('ReportTypeModel');

	}

	public function index_get()
	{
		$reportTypeModel = new ReportTypeModel;
		$result = $reportTypeModel->get();
		$this->response($result, RestController::HTTP_OK);
	}
	public function find_get($id)
	{

		$reportTypeModel = new ReportTypeModel;
		$result = $reportTypeModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


}
