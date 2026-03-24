<?php

defined('BASEPATH') or exit('No direct script access allowed');

class DepoModel extends CI_Model
{

	public $table = 'depos';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$query = $this->db
			->order_by('name', 'asc')
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

	public function has_trip_tickets($id)
	{
		return $this->db
			->from('trip_ticket')
			->where('depo_id', $id)
			->count_all_results() > 0;
	}

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}
}
