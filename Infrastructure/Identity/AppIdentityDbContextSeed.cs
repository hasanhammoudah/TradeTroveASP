using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager){
            if(!userManager.Users.Any()){
                var user = new AppUser{
                    DisplayName="Hasan",
                    Email ="Hasan@gmail.com",
                    UserName="Hasan@gmail.com",
                    Address=new Address{
                        FirstName="Hasan",
                        LastName="Hammoudah",
                        Street="TT",
                        City="TR",
                        State="OP",
                        ZipCode="999974"
                    }
                };

                await userManager.CreateAsync(user,"Hasan$1234");
            }
        }
    }
}