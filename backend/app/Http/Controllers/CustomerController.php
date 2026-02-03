<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index() {
        return Customer::all();
    }

    public function store(Request $request) {
        return Customer::create($request->all());
    }

    public function show($id) {
        $customer = Customer::with([
            'devices', 
            'repairOrders' => function($query) {
                $query->with(['status', 'devices']) 
                    ->orderBy('receive_date', 'desc')
                    ->limit(5);
            }
        ])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $customer
        ]);
    }

    public function update(Request $request, $id) {
        $customer = Customer::findOrFail($id);
        $customer->update($request->all());
        return $customer;
    }

    public function destroy($id) {
        Customer::destroy($id);
        return response()->json(['message' => 'deleted']);
    }
}

