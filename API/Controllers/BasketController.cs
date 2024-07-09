using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepository;
        public BasketController(IBasketRepository basketRepository)
        {
            _basketRepository = basketRepository;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Basket ID cannot be null or empty");
            }

            var basket = await _basketRepository.GetBasketAsync(id);
            return Ok(basket ?? new CustomerBasket(id));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket basket)
        {
            if (basket == null || string.IsNullOrEmpty(basket.Id))
            {
                return BadRequest("Invalid basket data");
            }

            var updateBasket = await _basketRepository.UpdateBasketAsync(basket);
            return Ok(updateBasket);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBasketAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Basket ID cannot be null or empty");
            }

            await _basketRepository.DeleteBasketAsync(id);
            return NoContent();
        }
    }
}
