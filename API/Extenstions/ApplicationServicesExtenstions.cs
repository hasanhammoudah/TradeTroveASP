using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;

namespace API.Extenstions
{
    public static class ApplicationServicesExtenstions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<StoreContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            services.AddScoped<IBasketRepository, BasketRepository>();     
            services.AddScoped<IProductRepository, ProductRepository>();

            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddSingleton<IConnectionMultiplexer>(c =>
            {
             var options = ConfigurationOptions.Parse(config.GetConnectionString("Redis"));
             return ConnectionMultiplexer.Connect(options);
            });
            //Note : This code snippet configures an ASP.NET Core API to customize the handling of invalid model state responses by creating a custom response containing detailed validation error messages extracted from the model state.
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = ActionContext =>
                {
                    var errors = ActionContext.ModelState.Where(e => e.Value.Errors.Count > 0).SelectMany(x => x.Value.Errors).Select(x => x.ErrorMessage).ToArray();
                    var errorResponse = new ApiValidationErrorResponse
                    {
                        Errors = errors
                    };
                    return new BadRequestObjectResult(errorResponse);
                };
            });
            //Note: This code configures CORS (Cross-Origin Resource Sharing) for the ASP.NET Core application to allow requests from a specific 
            //origin (https://localhost:4200) with any header and method.

            //Note : The benefit of configuring CORS (Cross-Origin Resource Sharing) in an ASP.NET Core application is to allow resources (e.g., APIs) 
            //to be requested from a different domain, origin, or protocol, enabling cross-origin communication between clients and servers.
            // This is particularly useful in scenarios where your application's frontend (client) is hosted on a different domain or port than your backend (server), 
            //such as when developing a single-page application (SPA) with a separate frontend and backend. 
            //By configuring CORS, you can control which origins are allowed to access your API endpoints, enhancing security while enabling cross-domain requests.
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                });
            });

            return services;
        }
    }
}



