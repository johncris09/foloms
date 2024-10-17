<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class FuelPumpDispense extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('TripTicketModel');
		$this->load->model('ProductModel');
		$this->load->model('DeliveryModel');
		

	}
	public function index_get()
	{
		return true;
	}

	public function filter_get()
	{
		$tripTicketModel = new TripTicketModel;
		$deliveryModel = new DeliveryModel;
		$productModel = new ProductModel;
		$requestData = $this->input->get();

		$data = [];
		if (isset($requestData['purchase_date']) && $requestData['purchase_date'] != "") {
			$data = array(
				'trip_ticket.purchase_date' => date('Y-m-d', strtotime($requestData['purchase_date']))
			);
		}
		if (isset($requestData['office']) && $requestData['office'] != "") {
			$data['equipment.office'] = $requestData['office'];
		}

		$summary_consumptions = $tripTicketModel->get_summary_consumption($data);
		$summary_consumption_data = [];
		foreach ($summary_consumptions as $summary_consumption) {



			// Extract the control number and purchase date
			$controlNumber = str_pad($summary_consumption->control_number, 4, '0', STR_PAD_LEFT);
			$purchaseDate = date('m-d-y', strtotime($summary_consumption->purchase_date));

			// Combine them into the desired format
			$formattedControlNumber = $purchaseDate . '-' . $controlNumber;


			$gasoline_purchased = 0;
			$gasoline_purchased = 0;


			$gasoline_purchased += floatval($summary_consumption->gasoline_purchased) + floatval($summary_consumption->gasoline_issued_by_office);

			$gross_amount = floatval($summary_consumption->unit_cost) * $gasoline_purchased;

			$summary_consumption_data[] = array(
				'formatted_control_number' => $formattedControlNumber,
				'control_number' => $summary_consumption->control_number,
				'purchase_date' => date('m/d/Y', strtotime($summary_consumption->purchase_date)),
				'plate_number' => $summary_consumption->plate_number != "" ? trim($summary_consumption->plate_number) : "",
				'model' => $summary_consumption->model != "" ? trim($summary_consumption->model) : "",
				'driver' => trim($summary_consumption->driver_last_name . ", " .
					$summary_consumption->driver_first_name . " " .
					$summary_consumption->driver_middle_name . " " .
					$summary_consumption->driver_suffix),
				'office' =>
					$summary_consumption->abbr != "" ? trim($summary_consumption->abbr) : ""
				,
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


		$products = $productModel->get();
		$product_summary_consumption = [];

		$unit_cost = 0;

		foreach ($products as $product) {


			if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {
				$data['product.id'] = $product->id;
				$previous_delivery_data = array(
					'product' => $product->id,
                    'date <=' => date('Y-m-d', strtotime($requestData['purchase_date']))
				);

				$previous_delivery = $deliveryModel->get_previous_delivery_data($previous_delivery_data, 1);
				
				$unit_cost = 	$previous_delivery->price ;
				
				$consumption = $tripTicketModel->get_product_summary_consumption($data);
				$product_summary_consumption[] = array(
					'product' => $consumption->product,
					'unit_cost' => $unit_cost,
					'total_purchase' => $consumption->total_purchase ? $consumption->total_purchase : number_format(0, 2, '.', ','),
					// 'total_cost' => $consumption->total_purchase ? $consumption->total_purchase : number_format(0, 2, '.', ','),
				);
			}

		}

		$result = array(
			'consumption' => $summary_consumption_data,
			'summary' => $product_summary_consumption,

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
