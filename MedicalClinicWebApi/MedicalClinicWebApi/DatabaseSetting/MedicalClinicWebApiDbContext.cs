using MedicalClinicWebApi.Model.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MedicalClinicWebApi.DatabaseSetting
{
    public class MedicalClinicWebApiDbContext : IdentityDbContext<User, IdentityRole, string>
    {
        public MedicalClinicWebApiDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<UserType> UserTypes { get; set; }  
        public DbSet<User> Users { get; set; }
    }
}