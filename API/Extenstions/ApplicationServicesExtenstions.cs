using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace API.Extenstions
{
    public static class ApplicationServicesExtenstions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,IConfiguration config){
services.AddEndpointsApiExplorer();
services.AddSwaggerGen();
services.AddDbContext<StoreContext>(opt=>{
    opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
});
services.AddScoped<IProductRepository,ProductRepository>();
services.AddScoped(typeof(IGenericRepository<>),typeof(GenericRepository<>));
services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
//Note : This code snippet configures an ASP.NET Core API to customize the handling of invalid model state responses by creating a custom response containing detailed validation error messages extracted from the model state.
services.Configure<ApiBehaviorOptions>(options =>{
options.InvalidModelStateResponseFactory = ActionContext=>{
    var errors = ActionContext.ModelState.Where(e=>e.Value.Errors.Count>0).SelectMany(x=>x.Value.Errors).Select(x=>x.ErrorMessage).ToArray();
    var errorResponse = new ApiValidationErrorResponse{
        Errors=errors
    };
    return new BadRequestObjectResult(errorResponse);
};
});

            return services;
        }
    }
}