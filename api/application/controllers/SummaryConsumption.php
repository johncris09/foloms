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

		$summary_consumptions = $tripTicketModel->get_summary_consumption($data);
		$summary_consumption_data = [];
		foreach ($summary_consumptions as $summary_consumption) {

			$gasoline_purchased = 0;
			$gasoline_purchased = 0;


			$gasoline_purchased += floatval($summary_consumption->gasoline_purchased) + floatval($summary_consumption->gasoline_issued_by_office);

			$gross_amount = floatval($summary_consumption->unit_cost) * $gasoline_purchased;

			$summary_consumption_data[] = array(
				'control_number' => $summary_consumption->control_number,
				'purchase_date' => date('m/d/Y', strtotime($summary_consumption->purchase_date)),
				'plate_number' => trim($summary_consumption->plate_number),
				'model' => trim($summary_consumption->model),
				'driver' => trim($summary_consumption->driver_first_name . " " .
					$summary_consumption->driver_last_name . " " .
					$summary_consumption->driver_middle_name . " " .
					$summary_consumption->driver_suffix),
				'office' => trim($summary_consumption->abbr),
				'purposes' => trim($summary_consumption->purposes),
				'product' => trim($summary_consumption->product),
				'unit_cost' =>
					number_format($summary_consumption->unit_cost, 2, '.', ','),
				'gasoline_issued_by_office' => trim($summary_consumption->gasoline_issued_by_office),
				'gasoline_purchased' =>
					number_format($gasoline_purchased, 2, '.', ','),
				'gross_amount' =>
					number_format($gross_amount, 2, '.', ','),
			);


		}

		$result = array(
			'consumption' => $summary_consumption_data,
			'summary' => $tripTicketModel->get_product_summary_consumption($data),

		);
		$this->response($result, RestController::HTTP_OK);

	}



	private function formatDriverName($firstName, $middleName, $lastName, $suffix)
	{
		return trim(ucwords($firstName)) . " " .
			trim(ucwords($middleName)) . " " .
			trim(ucwords($lastName)) . " " .
			trim(ucwords($suffix));
	}

}
