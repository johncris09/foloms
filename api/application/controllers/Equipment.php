<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Equipment extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('EquipmentModel');
		$this->load->model('TripTicketModel');
		$this->load->model('ProductModel');

	}

	public function index_get()
	{
		$equipmentModel = new EquipmentModel;
		$result = $equipmentModel->get();
		$this->response($result, RestController::HTTP_OK);
	}
	
	public function top_consumption_get()
	{
		
		$productModel = new ProductModel;
		$tripTicketModel = new TripTicketModel;

		
		$requestData = $this->input->get();
		
		$data = [];
		$categories = [];
		$seriesData = [];
		$whereData = [];
		$top = 10;

		
		
		if (isset($requestData['top']) && !empty($requestData['top'])) {
			$top = $requestData['top'];
		}

		if (isset($requestData['month']) && !empty($requestData['month'])) {
			$whereData['month(purchase_date)'] = $requestData['month'];
		}

		if (isset($requestData['year']) && !empty($requestData['year'])) {
			$whereData['year(purchase_date)'] = $requestData['year'];
		}


		
		$equipments = $tripTicketModel->get_top_equipment($whereData, $top);

		$products = $productModel->get();
		foreach ($products as $product) {

			if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {

				$seriesData[$product->product] = [
					'name' => $product->product,
				];
			}

		}

		foreach ($products as $product) {

			if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {
				foreach ($equipments as $equipment) {

					$categories[$equipment->id] = trim( $equipment->plate_number ." ". $equipment->model  ) ;


					$whereData['equipment.id'] = $equipment->id;
					$whereData['product.id'] = $product->id;


					$result = $tripTicketModel->get_total_by_equipment_by_product($whereData);
					$seriesData[$product->product]['data'][] = floatval($result->purchased);
				}

			}

		}
		
		$data = [
			'categories' => array_values($categories),
			'series' => array_values($seriesData)
		];
		$this->response($data, RestController::HTTP_OK);

	}

	// public function top_consumption_get()
	// {
	// 	$equipmentModel = new EquipmentModel;
	// 	$productModel = new ProductModel;
	// 	$tripTicketModel = new TripTicketModel;
	// 	$data = [];

	// 	$equipments = $equipmentModel->get();


	// 	foreach ($equipments as $equipment) {



	// 		$equipmentData = [
	// 			'model' => trim($equipment->model),
	// 			'plate_number' => trim($equipment->plate_number),
	// 		];

	// 		$total = 0;
	// 		$products = $productModel->get();

	// 		foreach ($products as $product) {

	// 			if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {

	// 				$whereData = array(
	// 					'equipment.id' => $equipment->id,
	// 					'product.id' => $product->id,
	// 				);
	// 				$result = $tripTicketModel->get_total_by_equipment_by_product($whereData);


	// 				// Append the product data to the driver data array
	// 				$equipmentData[strtolower($result->product)] = $result->purchased > 0 ? number_format($result->purchased, 2, '.', ',') : 0;

	// 				$total += $result->purchased;
	// 			}


	// 		}

	// 		$equipmentData['total'] = number_format($total, 2, '.', ',');

	// 		$data[] = $equipmentData;

	// 	}


	// 	usort($data, function ($a, $b) {
	// 		return $b['total'] <=> $a['total'];
	// 	});

	// 	$top10 = array_slice($data, 0, 10);



	// 	$categories = [];
	// 	$dieselData = [];
	// 	$premiumData = [];
	// 	$regularData = [];

	// 	foreach ($top10 as $entry) {
	// 		$categories[] = trim( $entry['plate_number'] . ' ' . $entry['model']);
	// 		$dieselData[] = (float) $entry['diesel'];
	// 		$premiumData[] = (float) $entry['premium'];
	// 		$regularData[] = (float) $entry['regular'];
	// 	}

	// 	$series = [
	// 		[
	// 			"name" => "Diesel",
	// 			"data" => $dieselData
	// 		],
	// 		[
	// 			"name" => "Premium",
	// 			"data" => $premiumData
	// 		],
	// 		[
	// 			"name" => "Regular",
	// 			"data" => $regularData
	// 		]
	// 	];

	// 	$result = [
	// 		"categories" => $categories,
	// 		"series" => $series
	// 	];

	// 	$this->response($result, RestController::HTTP_OK);

	// }



	public function find_get($id)
	{

		$equipmentModel = new EquipmentModel;
		$result = $equipmentModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$equipmentModel = new EquipmentModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'model' => $requestData['model'],
			'plate_number' => $requestData['plate_number'],
			'fuel_capacity' => $requestData['fuel_capacity'],
			'office' => $requestData['office'],
			'equipment_type' => $requestData['equipment_type'],
			'include_description' => $requestData['include_description'],
			'report_type' => $requestData['report_type'],

		);



		$result = $equipmentModel->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new user.'
			], RestController::HTTP_BAD_REQUEST);
		}
	}

	public function update_put($id)
	{


		$equipmentModel = new EquipmentModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		if (isset($requestData['model'])) {
			$data['model'] = $requestData['model'];
		}
		if (isset($requestData['plate_number'])) {
			$data['plate_number'] = $requestData['plate_number'];
		}
		if (isset($requestData['fuel_capacity'])) {
			$data['fuel_capacity'] = $requestData['fuel_capacity'];
		}
		if (isset($requestData['office'])) {
			$data['office'] = $requestData['office'];
		}
		if (isset($requestData['equipment_type'])) {
			$data['equipment_type'] = $requestData['equipment_type'];
		}
		if (isset($requestData['include_description'])) {
			$data['include_description'] = $requestData['include_description'];
		}
		if (isset($requestData['report_type'])) {
			$data['report_type'] = $requestData['report_type'];
		}
		$update_result = $equipmentModel->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$equipmentModel = new EquipmentModel;
		$result = $equipmentModel->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

}
