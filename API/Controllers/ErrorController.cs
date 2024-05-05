using API.Errors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("errors/{code}")]
    //Note: [ApiExplorerSettings(IgnoreApi = true)] is an attribute used in ASP.NET Web API to exclude specific controllers or action methods from being documented by the API Explorer.
    [ApiExplorerSettings(IgnoreApi =true)]
    public class ErrorController : BaseApiController
    {
        public IActionResult Error(int code){
            return new ObjectResult(new ApiResponse(code));
        }
    }
}