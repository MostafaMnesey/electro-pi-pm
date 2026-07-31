import { mainRoles } from "../../Utils/Enums/roles.js";
import { errorResponse } from "../../Utils/Response.js";
import { compareText, hashText } from "../../Utils/Security/index.js";
import { generateTokensForUser } from "../../Utils/Token/token.js";
import * as db from "../../database/dbService.js";

export const getProfileService = async (req) => {
  const {user}=req

 
  return user;
};
export const usersService = async (req) => {
  const {page=1,limit=10,search,role,approved}=req.query
const where = {}
if(search){
  where.OR = [
    { name: { contains: search,mode:"insensitive" } },
    { email: { contains: search,mode:"insensitive" } },
    { phone: { contains: search,mode:"insensitive" } },
  ]
}
if(role){
  const userRole = await db.findOne({
    model: "role",
    where: {
      name: role
    },
    select: {
      id: true
    }
  })
  if(!userRole){
    return errorResponse({
      res,
      message: MESSAGES.ROLE_NOT_FOUND
    })
  }
  where.roleId = userRole.id
}
if(approved){
  where.approved = Boolean(approved)
}
console.log(where);

  const users = await db.findManyWithPaginationAndCount({
    model: "user",
    page,
    limit,
    where,
    select:{
      id:true,
      name:true,
      email:true,
      phone:true,
      approved:true,
      createdAt:true,
      role:{
        select:{
          id:true,
          name:true
        }
      }
    }
 
    
  });
  return users;
};
