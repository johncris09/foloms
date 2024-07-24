<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Supplier extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('SupplierModel');
		$this->load->model('ProductModel');
		$this->load->model('TripTicketModel');

	}

	public function index_get()
	{
		$supplierModel = new SupplierModel;
		$result = $supplierModel->get();
		$this->response($result, RestController::HTTP_OK);
	}
	public function top_consumption_get()
	{
		$supplierModel = new SupplierModel;
		$productModel = new ProductModel;
		$tripTicketModel = new TripTicketModel;
		$data = [];

		$suppliers = $supplierModel->get();


		foreach ($suppliers as $supplier) {

			$supplierData = [
				'supplier' => $supplier->supplier,
			];

			$total = 0;
			$products = $productModel->get();

			foreach ($products as $product) {


				if (in_array(strtolower($product->product), ['diesel', 'premium', 'regular'])) {

					$whereData = array(
						'supplier.id' => $supplier->id,
						'product.id' => $product->id,
					);
					$result = $tripTicketModel->get_total_by_supplier_by_product($whereData, $product->product);

					// Append the product data to the supplier data array
					$supplierData[strtolower($result->product)] = $result->purchased > 0 ? number_format($result->purchased, 2, '.', ',') : 0;

					$total += $result->purchased;

				}

			}

			$supplierData['total'] = number_format($total, 2, '.', ',');

			$data[] = $supplierData;

		}


		usort($data, function ($a, $b) {
			return $b['total'] <=> $a['total'];
		});

		$top10 = array_slice($data, 0, 10);
		$this->response($top10, RestController::HTTP_OK);

	}
	public function find_get($id)
	{

		$supplierModel = new SupplierModel;
		$result = $supplierModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$supplierModel = new SupplierModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'supplier' => $requestData['supplier'],
		); 
		$result = $supplierModel->insert($data);

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


		$supplierModel = new SupplierModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		
		if (isset($requestData['supplier'])) {
			$data['supplier'] = $requestData['supplier'];
		}


		$update_result = $supplierModel->update($id, $data);

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
		$supplierModel = new SupplierModel;
		$result = $supplierModel->delete($id);
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
