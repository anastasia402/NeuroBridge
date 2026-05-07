using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace NeuroBridgeBackend.Entities
{
    public class TestEntity
    {
        [Key]
        public Guid EntityId{ get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int Age { get; set; }
    }
}
