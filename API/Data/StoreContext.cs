using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
               
        }
        public DbSet<Product> Products { get; set; }
    }
}

//https://www.nuget.org/packages/dotnet-ef