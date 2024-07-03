<?php

defined('BASEPATH') or exit('No direct script access allowed');

class EquipmentModel extends CI_Model
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
				equipment.model,
				equipment.plate_number,
				equipment.fuel_capacity,
				office.id office_id,
				office.office,
				office.abbr,
				equipment_type.id   equipment_type_id,
				equipment_type.type,
				equipment_type.times,
				equipment_type.tank_balance, 
				')
			->from('equipment')
			->join('office', 'equipment.office = office.id', 'LEFT')
			->join('equipment_type', 'equipment.equipment_type = equipment_type.id', 'LEFT')
			->order_by('equipment.model');


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
