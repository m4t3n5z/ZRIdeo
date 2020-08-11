using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ideo.Models;

namespace Ideo.Controllers
{
    public class HomeController : Controller
    {
        string connectionString = "Data Source = (LocalDB)\\MSSQLLocalDB;"
              + "AttachDbFilename = \"C:\\Moje\\Programowanie\\v2\\Nowy folder\\Ideo\\Ideo\\Ideo\\App_Data\\TreeNodeDB.mdf\"; Integrated Security = True";
 
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }


        [HttpGet]
        public ActionResult GetRoot()
        {
            TreeNode treeNode = new TreeNode();

            string query = "Select * from dbo.TreeNode";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    if ((int)reader[2] == 0) 
                    { 
                    treeNode.Id = (int)reader[0];
                    treeNode.Name = (string)reader[1];
                    treeNode.ParentId = (int)reader[2];
                    treeNode.IsFolder = (bool)reader[3];
                    }

                }
            }

            return Json(treeNode, JsonRequestBehavior.AllowGet);

        }

        public ActionResult GetChildrenOf(int Id)
        {
            List<TreeNode> treeNodes = new List<TreeNode>();

            string query = "Select * from dbo.TreeNode";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {    
                    if (Id == (int)reader[2])
                        treeNodes.Add(new TreeNode { Id = (int)reader[0], Name = (string)reader[1], ParentId = (int)reader[2], IsFolder = (bool)reader[3] });

                }
            }

            return Json(treeNodes, JsonRequestBehavior.AllowGet);
        }

       
        public ActionResult AddNode(string Name, int ParentId, bool IsFolder)
        {

            TreeNode treeNode = new TreeNode();

             string query = "INSERT INTO dbo.TreeNode ( Name , ParentID, IsFolder ) VALUES ( @Name, @ParentID, @IsFolder)";
           
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);

                connection.Open();

                command.Parameters.Add("@Name", System.Data.SqlDbType.NChar).Value = Name;
                command.Parameters.Add("@ParentID", System.Data.SqlDbType.Int).Value = ParentId;
                command.Parameters.Add("@IsFolder", System.Data.SqlDbType.Bit).Value = IsFolder;

                command.ExecuteReader();

            }

            treeNode.Name = Name;
            treeNode.IsFolder = IsFolder;
            treeNode.ParentId = ParentId;

            return Json(treeNode, JsonRequestBehavior.AllowGet);

        }

        public ActionResult ChangeName(int Id, string NewName)
        {
            TreeNode treeNode = new TreeNode();

            string query = "UPDATE  dbo.TreeNode SET Name=@Name WHERE ID = @ID";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);

                connection.Open();

                command.Parameters.Add("@Name", System.Data.SqlDbType.NChar).Value = NewName;
                command.Parameters.Add("@ID", System.Data.SqlDbType.Int).Value = Id;

                command.ExecuteReader();
                treeNode.Name = NewName;

                if (treeNode == null)
                {
                    throw new NotImplementedException();
                }
            }
            return Json(treeNode, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ChangeParent(int Id, int NewParentId)
        {

            TreeNode treeNode = new TreeNode();

          
            string query = "UPDATE  dbo.TreeNode SET ParentID=@ParentID WHERE ID = @ID";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);

                connection.Open();

                command.Parameters.Add("@ParentID", System.Data.SqlDbType.NChar).Value = NewParentId;
                command.Parameters.Add("@ID", System.Data.SqlDbType.Int).Value = Id;

                command.ExecuteReader();
                treeNode.ParentId = NewParentId;

                if (treeNode == null)
                {
                    throw new NotImplementedException();
                }
            }

            return Json(treeNode, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RemoveNode(int Id)
        {

            TreeNode treeNode = new TreeNode();

            string query = "DELETE FROM  dbo.TreeNode WHERE ID = @ID";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);

                connection.Open();

                command.Parameters.Add("@ID", System.Data.SqlDbType.Int).Value = Id;

                command.ExecuteReader();

                if (treeNode == null)
                {
                    throw new NotImplementedException();
                }

                connection.Close();
            }


            query = "DELETE FROM  dbo.TreeNode WHERE ParentID = @ParentID";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);

                connection.Open();

                command.Parameters.Add("@ParentID", System.Data.SqlDbType.Int).Value = Id;

                command.ExecuteReader();

                if (treeNode == null)
                {
                    throw new NotImplementedException();
                }

                connection.Close();
            }


            return Json(Id, JsonRequestBehavior.AllowGet);
        }
    }
}


