<?php

defined('BASEPATH') or exit('No direct script access allowed');

class DriverModel extends CI_Model
{

	public $table = 'driver';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$query = $this->db
			->order_by('last_name')
			->get($this->table);
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


	public function get_driver_latest_transaction($data)
	{

		$query = $this->db
			->query(' 
				SELECT
				trip_ticket.`purchase_date`,
				product.`product`,
				equipment.`model`,
				equipment.`plate_number`
			FROM
				trip_ticket
				LEFT JOIN product
				ON product.`id` = trip_ticket.`product`
				LEFT JOIN equipment
				ON equipment.id = trip_ticket.`equipment`
			WHERE trip_ticket.`driver` =' . $data['driver'] . '
			ORDER BY trip_ticket.`purchase_date` DESC
			LIMIT 1');

		if ($query->row()) {
			return $query->row();
		}
		return [
			"purchase_date" => "N/a",
			"product" => "N/a",
			"model" => "N/a",

		];


	}

}
