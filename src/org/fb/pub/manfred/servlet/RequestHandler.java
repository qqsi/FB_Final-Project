package org.fb.pub.manfred.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.lucene.document.Document;
import org.fb.pub.manfred.bean.Article;
import org.fb.pub.manfred.search_engine.SearchTest;
import org.fb.pub.manfred.util.DocToArticle;
import org.fb.pub.manfred.util.JSONParser;

public class RequestHandler extends HttpServlet {
	private static String indexDir = "/Users/manfreddrathen/Documents/workspace/02652/XMLIndex/index";
	private SearchTest searchEngine;
	
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        try {
            System.out.println("RequestHandler In--------------!");
            String query = req.getParameter("query");

            int num = Integer.parseInt(req.getParameter("num"));
            
            searchEngine = new SearchTest(indexDir);
            
            String[] terms = query.trim().split(" ");
			ArrayList<Document> docList = searchEngine.retrieval("abstract", terms, num);
			ArrayList<Article> articleList = DocToArticle.parse(docList);
			
			JSONParser jsonParser = new JSONParser();
			String res = jsonParser.parse(articleList);
			System.out.println(res);
			
			resp.setContentType("text/json;charset=UTF-8");
			PrintWriter out = resp.getWriter();
			out.print(res);			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        this.doGet(req, resp);
    }
}
