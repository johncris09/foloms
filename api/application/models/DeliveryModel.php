<?php

defined('BASEPATH') or exit('No direct script access allowed');

class DeliveryModel extends CI_Model
{

	public $table = 'delivery';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$query = $this->db
			->select('
				delivery.id,
				delivery.date,
				delivery.liters,
				delivery.price,
				supplier.id supplier_id,
				supplier.supplier,
				product.id product_id,
				product.product
			
			
			')
			->from($this->table)
			->join('supplier', 'delivery.supplier = supplier.id', 'LEFT')
			->join('product', 'delivery.product = product.id', 'LEFT')
			->order_by('delivery.date desc')
			->get();
		return $query->result();
	}



	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}

	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}


	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}

	public function get_previous_delivery_data($data, $limit = 1)
	{

		$query = $this->db->where($data)
			->order_by('date', 'desc')
			->limit($limit)
			->get($this->table);

		return $query->row();
	}


	public function get_previous_next_delivery($data)
	{


		// Prepare the SQL query
		$sql = "
			(
				SELECT 'previous' AS type, delivery.price, date
				FROM delivery
				WHERE date <= ? AND product = ?
				ORDER BY date DESC
				LIMIT 1
			)
			UNION ALL
			(
				SELECT 'next' AS type, delivery.price, DATE_SUB(date, INTERVAL 1 DAY) AS date
				FROM delivery
				WHERE date > ? AND product = ?

				ORDER BY date ASC
				LIMIT 1
			)
		";

		// Run the query with bound parameters
		$query = $this->db->query($sql, array($data['date'], $data['product'], $data['date'], $data['product']));

		$result = $query->result();


		// Check if no next delivery was found
		$has_next = false;
		foreach ($result as $delivery) {
			if ($delivery->type == 'next') {
				$has_next = true;
				break;
			}
		}

		// If no next delivery, add a default next delivery (filter date + 1 day)
		if (!$has_next) {
			// Add 1 year to the filter date
			$next_date = date('Y-m-d', strtotime($data['date'] . ' +1 day'));

			// Add this default delivery to the result set
			$default_next = (object) [
				'type' => 'next',
				'price' => null,  // No price since it's a default value
				'date' => $next_date
			];

			// Add the default next delivery to the result array
			$result[] = $default_next;
		}

		return $result;

	}


}
