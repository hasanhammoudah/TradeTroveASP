using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly StoreContext _context;
        public ProductRepository(StoreContext context)
        {
          _context =context;
        }

        public async Task<IReadOnlyList<ProductBrand>> GetProductBrandsAsync()
        {
            return await _context.ProductBrands.ToListAsync(); 
        }

        public async Task<IReadOnlyList<ProductType>> GetProductTypesAsync()
        {
             return await _context.ProductTypes.ToListAsync(); 

        }

        async Task<Product> IProductRepository.GetProductByIdAsync(int id)
        {
           return await _context.Products.
             Include(p=>p.ProductType).
             Include(p=>p.ProductBrand).
             FirstOrDefaultAsync(p=>p.Id == id);
            // FindAsync(id);
        }

        async Task<IReadOnlyList<Product>> IProductRepository.GetProductsAsync()
        {
            return await _context.Products.
            Include(p=>p.ProductType).
            Include(p=>p.ProductBrand).
            ToListAsync();
        }
    }
}