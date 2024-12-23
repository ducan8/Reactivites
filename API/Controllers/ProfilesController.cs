﻿using Application.Profiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseAPIController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandlerResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUserActivities(string username, string predicate)
        {
            return HandlerResult(await Mediator.Send(new ListActivities.Query { Username = username, Predicate = predicate }));
        }
    }
}
