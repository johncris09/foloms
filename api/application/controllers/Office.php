<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Office extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('OfficeModel');
		$this->load->model('ProductModel');
		$this->load->model('TripTicketModel');

	}

	public function index_get()
	{
		$officeModel = new OfficeModel;
		$result = $officeModel->get();

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

		$offices = $tripTicketModel->get_top_office($whereData, $top);

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
				foreach ($offices as $office) {

					$categories[$office->id] = $office->office;


					$whereData['office.id'] = $office->id;
					$whereData['product.id'] = $product->id;


					$result = $tripTicketModel->get_total_by_office_by_product($whereData);
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
	public function find_get($id)
	{

		$officeModel = new OfficeModel;
		$result = $officeModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$officeModel = new OfficeModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'abbr' => $requestData['abbr'],
			'office' => $requestData['office'],
		);



		$result = $officeModel->insert($data);

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


		$officeModel = new OfficeModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		if (isset($requestData['abbr'])) {
			$data['abbr'] = $requestData['abbr'];
		}
		if (isset($requestData['office'])) {
			$data['office'] = $requestData['office'];
		}


		$update_result = $officeModel->update($id, $data);

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
		$officeModel = new OfficeModel;
		$result = $officeModel->delete($id);
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
