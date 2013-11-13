package org.fb.pub.manfred.util;

import java.util.ArrayList;

import com.google.gson.Gson;

public class JSONParser {
	Gson parser;
	
	public JSONParser(){
		parser = new Gson();
	}
	
	public String parse(Object obj){
		return parser.toJson(obj);
	}
	
	public <T> String parse(ArrayList<T> list){
		return parser.toJson(list);
	}
}
