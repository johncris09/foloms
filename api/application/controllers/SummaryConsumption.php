<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class SummaryConsumption extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('TripTicketModel');

	}
	public function index_get()
	{
		return true;
	}




	public function filter_get()
	{
		$tripTicketModel = new TripTicketModel;
		$requestData = $this->input->get();

		$data = array(
			'trip_ticket.purchase_date' => date('Y-m-d', strtotime($requestData['purchase_date']))
		);


		$result =
			$result = array(
				'consumption' => $tripTicketModel->get_summary_consumption($data),
				'summary' => $tripTicketModel->get_product_summary_consumption($data),

			);
		$this->response($result, RestController::HTTP_OK);

	}



}
