package org.fb.pub.manfred.util;

import java.util.ArrayList;

import org.apache.lucene.document.Document;
import org.fb.pub.manfred.bean.Article;

public class DocToArticle {
	public static Article parse(Document doc){
		Article res = new Article();
		res.setAbs(doc.get("abstract"));
		res.setPmid(doc.get("pmid"));
		
		return res;
	}
	
	public static ArrayList<Article> parse(ArrayList<Document> docList){
		ArrayList<Article> res = new ArrayList<Article>();
		
		for(int i = 0; i < docList.size(); i++){
			res.add(parse(docList.get(i)));
		}
		
		return res;
	}
}
