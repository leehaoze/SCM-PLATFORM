package com.jabil.scm.dao;

import com.jabil.scm.model.Category;
import com.jabil.scm.model.URL;
import com.jabil.scm.utils.SqlConnection;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

@Repository
public class urlDao {
    private Connection connection;
    private Statement statement;
    private SqlConnection sqlConnection = new SqlConnection();
    private ResultSet resultSet;
    private ArrayList<Category> category;

    public urlDao(){
        categoryDao dao = new categoryDao();
        category = dao.getCategory();
    }

    private void getCategoryNameByID(URL url){
        String []cateIDs = url.getCategory_id().split(",");
        for(int i = 0; i < cateIDs.length; ++i){
            for(Category category: this.category){
                if(category.getId() == Integer.parseInt(cateIDs[i])){
                    url.addCategory(category.getName());
                }
            }
        }
    }

    public ArrayList<URL> getUrl(){
        connection = sqlConnection.connectSQL();
        statement = sqlConnection.createStatement(connection);
        ArrayList<URL> list = new ArrayList<URL>();
        try {
            resultSet = statement.executeQuery("SELECT * FROM URL");
            while(resultSet.next()){
                URL url = new URL(resultSet);
                getCategoryNameByID(url);
                list.add(url);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        //关闭连接
        finally {
            /*try {
                if (resultSet != null) resultSet.close();
                if (statement != null) statement.close();
                if (connection != null) connection.close();

            } catch (SQLException e) {
                e.printStackTrace();
            }*/
            sqlConnection.closeConnect(connection, statement, resultSet);

        }
        return list;
    }
    /**
     *
     * @param url
     */
    public void insertUrl(URL url){
        connection = sqlConnection.connectSQL();
        statement = sqlConnection.createStatement(connection);
        String sql = "insert into URL values(" + "'" + url.getLink() + "','" + url.getTitle() + "','" + url.getPicPath() +
                "','" + url.getDescription() + "','" + url.getCategory() + "')";
        try{
            statement.executeUpdate(sql);

        }catch (Exception e){
            e.printStackTrace();
        }
        finally {
            /*try {
                if (statement != null) statement.close();
                if (connection != null) connection.close();
                System.out.println("Close success");
            } catch (SQLException e) {
                e.printStackTrace();
            }*/
            sqlConnection.closeConnect(connection, statement, null);
        }
    }
}
