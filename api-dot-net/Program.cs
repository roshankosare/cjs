using System.Security.Claims;
using System.Text;
using CjsApi.Repositories;
using CjsApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using CjsApi.Data;
using CjsApi.Services.CodeExecution.Base;
using CjsApi.Services.CodeExecution.Executors;
using CjsApi.Services.CodeExecution.Factory;
using CjsApi.Infrastructure.Docker;
using CjsApi.Services.CodeExecution.Store;
using CjsApi.Services.CodeExecution.Worker;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // 🔥 REQUIRED for cookies
    });
});

var jwtSettings = builder.Configuration.GetSection("Jwt");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,          //Ensures the token was issued by your server only
            ValidateAudience = true,        //Ensures the token is meant for your server only
            ValidateLifetime = true,        //Ensures the token has not expired
            ValidateIssuerSigningKey = true,//Ensures the token signature is valid and trusted

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"]!)
            ),
            // 🔥 REQUIRED FOR ROLES
            RoleClaimType = ClaimTypes.Role
        };

        // 🔥 Read JWT from Cookie instead of Authorization header
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["access_token"];
                return Task.CompletedTask;
            }
        };
    });

// Add Authorization Services
builder.Services.AddAuthorization();



var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    )
);


// dependency Injection for Services and Repositories
builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepositoryImpl>();

builder.Services.AddSingleton<CodeExecutorBase, JavaCodeExecutor>();
builder.Services.AddSingleton<CodeExecutorBase, NodeCodeExecutor>();
builder.Services.AddSingleton<CodeExecutorBase, CppCodeExecutor>();
builder.Services.AddScoped<CodeExecutionService>();

builder.Services.AddSingleton<ICodeExecutorFactory, CodeExecutorFactory>();


builder.Services.AddSingleton<ExecutionJobStore>();

builder.Services.AddSingleton<CodeExecutionWorker>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<CodeExecutionWorker>());


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.MapControllers();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();






app.Run();

