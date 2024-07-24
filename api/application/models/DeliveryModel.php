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



}
