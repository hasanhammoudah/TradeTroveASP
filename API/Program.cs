using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using API.Middleware;
using API.Extenstions;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Core.Entities.Identity;
using API.Extensions;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();
// Note: UseStatusCodePagesWithReExecute("/errors/{0}") is used to configure the application to handle HTTP status codes by redirecting to a specified error page ("/errors/{0}").

app.UseStatusCodePagesWithReExecute("/errors/{0}");
// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();


app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions{
    FileProvider = new  PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Content")),RequestPath="/Content"
});

app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToController("Index","Fallback");


//Note This code block sets up a scoped environment, retrieves necessary services like the database 
//context and logger, attempts to migrate the database and seed initial data, and logs any errors that occur during this process.
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var context = services.GetRequiredService<StoreContext>();
var identityContext = services.GetRequiredService<AppIdentityDbContext>();
var userManager = services.GetRequiredService<UserManager<AppUser>>();
var logger = services.GetRequiredService<ILogger<Program>>();
try
{
    await context.Database.MigrateAsync();
    await identityContext.Database.MigrateAsync();
    await StoreContextSeed.SeedAsync(context);
    await AppIdentityDbContextSeed.SeedUsersAsync(userManager);
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occured during migration");
}

app.Run();
