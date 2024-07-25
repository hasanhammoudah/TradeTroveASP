using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepository;
         private readonly IMapper _mapper;
        public BasketController(IBasketRepository basketRepository, IMapper mapper)
        {
            _basketRepository = basketRepository;
            _mapper=mapper;
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
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasketDto basket)
        {
        
            var customerBasket = _mapper.Map<CustomerBasketDto,CustomerBasket>(basket);

            var updateBasket = await _basketRepository.UpdateBasketAsync(customerBasket);
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
