using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extenstions
{
    public static class UserManagerExtensions
    {

        /// <summary>
        /// SingleOrDefaultAsync:
        /// Purpose: Finds a single entity that matches the given predicate or returns null if no such entity exists.

        /// Behavior:

        /// If exactly one entity matches the predicate, it returns that entity.
        /// If no entity matches the predicate, it returns null.
        /// If more than one entity matches the predicate, it throws an exception.
        /// </summary>

        public static async Task<AppUser> FindUserByClaimsPrincipleWithAddress(this UserManager<AppUser> userManager, ClaimsPrincipal user)
        {
            var email = user.FindFirstValue(ClaimTypes.Email);
            return await userManager.Users.Include(x => x.Address).SingleOrDefaultAsync(x => x.Email == email);

        }

        public static async Task<AppUser> FindByEmailFromClaimsPrinciple(this UserManager<AppUser> userManager, ClaimsPrincipal user)
        {

            return await userManager.Users.SingleOrDefaultAsync(x => x.Email == user.FindFirstValue(ClaimTypes.Email));

        }
    }
}