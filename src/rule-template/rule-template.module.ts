import { Module } from '@nestjs/common';
import { RuleTemplateService } from './rule-template.service';
import { RuleTemplateController } from './rule-template.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuleTemplate } from './entities/rule-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RuleTemplate])],
  controllers: [RuleTemplateController],
  providers: [RuleTemplateService],
  exports: [RuleTemplateService],
})
export class RuleTemplateModule {}
