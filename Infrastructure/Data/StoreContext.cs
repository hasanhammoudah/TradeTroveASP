using Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Infrastructure.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
               
        }
        public DbSet<Product> Products { get; set; }
    }
}

