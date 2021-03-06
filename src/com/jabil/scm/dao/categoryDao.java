package com.jabil.scm.dao;

import com.jabil.scm.model.Category;
import com.jabil.scm.utils.SqlConnection;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
@Repository
public class categoryDao {
    private Connection connection;
    private Statement statement;
    private ResultSet resultSet;
    private SqlConnection sqlConnection = new SqlConnection();

    /**
     * 获取所有的标签
     * @return
     */
    public ArrayList<Category> getCategory(){
        connection = sqlConnection.connectSQL();
        statement = sqlConnection.createStatement(connection);
        ArrayList<Category> cates = new ArrayList<Category>();
        try{
            resultSet = statement.executeQuery("SELECT * FROM Category");
            while(resultSet.next()){
                Category category = new Category(resultSet);
                cates.add(category);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        finally {
            sqlConnection.closeConnect(connection,statement,resultSet);
        }

        return cates;
    }

    /**
     *
     * @return 所有标签名
     */
    public ArrayList<String> getCategoryName(){
        connection = sqlConnection.connectSQL();
        statement = sqlConnection.createStatement(connection);
        ArrayList<String> cates = new ArrayList<String>();
        try{
            resultSet = statement.executeQuery("SELECT * FROM Category");
            while(resultSet.next()){
                Category category = new Category(resultSet);
                cates.add(category.getName());
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        finally {
            sqlConnection.closeConnect(connection,statement,resultSet);
        }

        return cates;
    }
    /**
     *
     * @param category
     */
    public void insertCategory(Category category){
        connection = sqlConnection.connectSQL();
        statement = sqlConnection.createStatement(connection);
        String sql = "insert into Category values(" + category.getId() + "," + "'" + category.getName() + "')";
        try{
            statement.executeUpdate(sql);
        }catch (Exception e){
            e.printStackTrace();
        }
        finally {
            sqlConnection.closeConnect(connection, statement, null);
        }
    }

}
