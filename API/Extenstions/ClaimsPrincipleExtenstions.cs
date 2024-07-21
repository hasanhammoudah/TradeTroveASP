using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Extenstions
{
    public static class ClaimsPrincipleExtenstions
    {
        public static string RetrieveEmailFromPrinciple(this ClaimsPrincipal user){
            return user?.Claims?.FirstOrDefault(x=>x.Type == ClaimTypes.Email)?.Value;
        }
    }
}