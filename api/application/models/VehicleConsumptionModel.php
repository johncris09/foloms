<?php

defined('BASEPATH') or exit('No direct script access allowed');

class VehicleConsumptionModel extends CI_Model
{

	public $table = 'equipment';

	public function __construct()
	{
		parent::__construct();
	}

	public function get() 
	{
		$this->db
			->select(' 
				equipment.id,
				equipment.plate_number,
				equipment.model,
				SUM(trip_ticket.gasoline_purchased + trip_ticket.gasoline_issued_by_office) AS total_purchased')
			->from('trip_ticket')
			->join('equipment', 'trip_ticket.equipment = equipment.id', 'left')
			// ->where($data)
			->group_by('trip_Ticket.equipment')
			->order_by('total_purchased ', 'desc') ;

		$query = $this->db->get();

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
